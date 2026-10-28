// Public demo helpers. Everything here is switched on by VITE_DEMO_MODE=true at build time (see deploy/README.md) and
// does nothing in a regular build.
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

// The accounts the backend seeds (DataLoader). They are re-created by the nightly reset.
export const DEMO_ACCOUNTS = [
  { label: 'Customer', email: 'test@test.com', password: 'test' },
  { label: 'Admin', email: 'admin@admin.com', password: 'test' },
] as const

// Stripe's published test card: the demo runs in Stripe test mode and never moves real money.
export const TEST_CARD = {
  number: '4242 4242 4242 4242',
  details: 'any future expiry date, any CVC, any postal code',
} as const
