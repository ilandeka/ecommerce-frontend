# Ecommerce demo frontend on Firebase Hosting

This app is the Vue frontend of the Ecommerce demo. It is published to Firebase Hosting on every push to `master`. The
backend, the database and the one-time Google Cloud setup live in the `Ecommerce` repository (folder `deploy/gcp`); this
repository only needs a few non-secret values from that setup.

```
GitHub Actions  --(keyless, Workload Identity Federation)-->  Google Cloud project (same one as the backend)
  type check + build the demo version                          Firebase Hosting   https://ilandeka-ecommerce.web.app
  deploy on push to master                                                        talks to the ecommerce-api Cloud Run service
```

| File | Purpose |
| --- | --- |
| `gcp/config.env` | Project id, project number, Hosting site and the Stripe publishable key. While the first three are empty, pushes to `master` only build. |
| `../.github/workflows/ci-cd.yml` | Type check and build on every pull request; build of the demo version and Firebase deploy on `master`. |
| `../firebase.json` | Hosting settings: single-page-app rewrite, security headers, long caching for hashed assets. |
| `../.env.example` | The build-time variables, for local use. |

## One-time setup

1. Run the Google Cloud setup from the backend repository first (`Ecommerce`, `deploy/README.md`). It creates the Hosting
   site and the keyless link to this repository.
2. Put your Stripe **test** publishable key (`pk_test_...`, Stripe Dashboard, Developers, API keys) into
   `STRIPE_PUBLISHABLE_KEY` in `deploy/gcp/config.env`. It is public by design; the workflow refuses a live key
   (`pk_live_...`). Check the other values against the backend's `deploy/gcp/config.env`. Push to `master`.
3. The *CI/CD* workflow builds the demo version, publishes it and checks that the published app points at the API. The
   address is `https://<ECOMMERCE_SITE_ID>.web.app` and appears in the run summary.

The API address is derived as `https://ecommerce-api-<project number>.<region>.run.app`. If the API ever gets its own
domain, set `ECOMMERCE_API_URL` in `gcp/config.env`.

## Demo build switches

The deploy workflow builds with these variables. None of them is secret, and none is set in a normal build, so the regular
application is unchanged.

| Variable | Demo value | Effect |
| --- | --- | --- |
| `VITE_API_URL` | Cloud Run address (no `/api`) | Where the app sends its requests and loads product pictures from. |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | The key Stripe.js uses on the payment form. |
| `VITE_DEMO_MODE` | `true` | Shows a banner with Stripe's test card number, a reminder on the payment form, and one-click fill-in of the demo accounts on the sign-in page. |

The demo accounts (`src/constants/demo.ts`) are the ones the backend seeds, so they only work against a backend that has been
seeded; the reset after every backend deploy and the nightly reset restore them.

## Local development

```bash
npm ci
cp .env.example .env.local     # put your pk_test_... key in it
npm run dev                    # uses .env.development: API at http://localhost:8080
```

Start the backend first (`Ecommerce` repository, `deploy/README.md`, "Local development"). A production build needs the API
address, because nothing environment-specific is committed:

```bash
VITE_API_URL=https://example-api.run.app VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... npm run build
```

Add `VITE_DEMO_MODE=true` to try the demo version locally.

## Everyday operations

* **Redeploy:** push to `master`, or run the workflow by hand (*Actions, CI/CD, Run workflow*).
* **Roll back:** Firebase console, *Hosting*, the site, *Release history*, *Rollback* on an earlier release.
* **Custom domain:** Firebase console, *Hosting*, *Add custom domain*. Then put the new address in `ECOMMERCE_PUBLIC_URL` in the
  backend's `deploy/gcp/config.env` and push there, so the API accepts calls from it and password reset links use it.
* **Checks that run on every pull request:** `npm run build` (type check and production build).

## How it is locked down

* No keys or tokens exist anywhere. GitHub Actions exchanges its short-lived identity token for access to the `gh-deployer`
  service account, and only for workflows of your own repositories that run on `main` or `master`. Pull requests get no
  access to Google Cloud at all.
* `gh-deployer` may publish to Firebase Hosting and deploy Cloud Run; it cannot read secrets or the database.
* The published site sends `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` and a strict referrer policy. Files
  under `/assets/` (named by content hash) are cached for a year, the entry page is always revalidated, so a new release
  shows up immediately.
* Login tokens are kept in the browser's `localStorage`, as before; the demo contains no real customer data.

## Troubleshooting

* **The deploy job is skipped.** `gcp/config.env` still has empty values.
* **The payment form does not appear / "Stripe.js failed to load".** Either `STRIPE_PUBLISHABLE_KEY` is empty in
  `gcp/config.env`, or an ad blocker blocks `js.stripe.com`.
* **Every request fails with a CORS error.** The backend only accepts the Hosting address from its `ECOMMERCE_SITE_ID`; see
  the backend's `deploy/README.md`.
* **Product pictures are broken after a while.** Pictures uploaded by the demo admin are not kept (see "Known limits" in the
  backend's `deploy/README.md`); the seeded products use the default picture.
* **`Unable to deploy to Hosting as there is no Hosting site`.** The backend's `bootstrap.sh` creates the site; run it again.
