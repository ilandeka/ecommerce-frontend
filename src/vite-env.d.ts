/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend origin, e.g. http://localhost:8080 (no trailing slash, no /api). */
  readonly VITE_API_URL: string
  /** Stripe publishable key (pk_test_... in the demo). */
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  /** "true" in the public demo: banner with the Stripe test card and demo logins. */
  readonly VITE_DEMO_MODE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
