# Stripe Integration — TODO

This is the single source of truth for finishing the Stripe Checkout integration.

Integrated **Hosted Stripe Checkout** (donors are redirected to a Stripe-hosted payment page).
Scenario **B**: no existing Checkout Session call was found, so a minimal server-side endpoint was added.

---

## Values to Replace

The following values are placeholders and must be updated before going live.

**Files containing placeholders:**
- [src/app/api/create-checkout-session/route.ts](src/app/api/create-checkout-session/route.ts)

| Field | Current Value | What to Set |
|-------|--------------|-------------|
| `mode` | `payment` | Set to `"payment"` for one-time charges or `"subscription"` for recurring billing. |
| `success_url` | `${process.env.DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}` | Points at the `/success` page (already created). Keep the `{CHECKOUT_SESSION_ID}` template. |
| `cancel_url` | `${process.env.DOMAIN}` | Your actual cancel/return page URL. |

> Amounts are **dynamic**: the donor picks a preset or enters a custom amount on the homepage,
> and the server builds `line_items[].price_data` (USD, validated to $1–$1000). No fixed Price ID is
> required. To use fixed prices instead, replace `line_items` with `[{ price: "price_...", quantity: 1 }]`
> using a real Price ID from the [Dashboard](https://dashboard.stripe.com/prices).

**Environment variables** (see [.env.example](.env.example)) — replace with your real values:

| Variable | What to Set |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Your Stripe secret key (`sk_test_...` / `sk_live_...`). Server-only. |
| `STRIPE_WEBHOOK_SECRET` | From the [Stripe webhooks dashboard](https://dashboard.stripe.com/workbench/webhooks). |
| `DOMAIN` | Your app domain (e.g. `https://donate.lordpipon.com`). Used to build success/cancel URLs. |

---

## Configured Parameters

These parameters were configured in Checkout Studio and are already set correctly.

**Files containing these parameters:**
- [src/app/api/create-checkout-session/route.ts](src/app/api/create-checkout-session/route.ts)

| Parameter | Value |
|-----------|-------|
| `ui_mode` | `hosted_page` |
| `billing_address_collection` | `auto` |
| `phone_number_collection.enabled` | `false` |
| `automatic_tax.enabled` | `false` |
| `allow_promotion_codes` | `false` |
| `submit_type` | `auto` |
| `saved_payment_method_options.payment_method_save` | `enabled` |
| `integration_identifier` | `hosted_web_0001` |
| `origin_context` | `web` |

> `payment_method_collection` was configured as `always` in Checkout Studio, but per the integration
> rules it is only sent when `mode === "subscription"`. Since the current mode is `payment`, it is
> intentionally omitted. Add it back if you switch to subscriptions.

> `ui_mode` value depends on the SDK version: SDK ≥ `21.0.0` uses `hosted_page`; older SDKs use
> `hosted`. Installed `stripe` version here is **23.0.0**, so `hosted_page` is correct.

---

## Setup and next steps

### 1. Environment variables

Copy `.env.example` to `.env.local` and fill in real values:

```bash
cp .env.example .env.local
```

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
DOMAIN=http://localhost:3000
```

In production (Vercel), add the same variables in **Project Settings → Environment Variables**, and set
`DOMAIN` to `https://donate.lordpipon.com`.

### 2. Install dependencies

The `stripe` package is already added:

```bash
npm install
```

### 3. Project structure (new files)

```
src/app/api/create-checkout-session/route.ts   # POST endpoint that creates the Checkout Session
src/app/success/page.tsx                         # post-payment thank-you page (success_url)
src/app/page.tsx                                 # amount picker + "Donate with Card" button
src/components/theme-toggle.tsx                  # light/dark/device switcher
.env.example                                     # template for required env vars
STRIPE_INTEGRATION_TODO.md                       # this file
```

### 4. How the integration works

1. The donor picks a preset or custom amount and clicks **“Donate $X”** on the homepage (`src/app/page.tsx`).
2. The client POSTs `{ amount }` to `/api/create-checkout-session`.
3. The server validates the amount, creates a hosted Checkout Session via
   `stripe.checkout.sessions.create(...)`, and returns `session.url`.
4. The browser is redirected to the Stripe-hosted payment page.
5. On success/cancel, Stripe redirects back to `success_url` (`/success`) / `cancel_url` (`/`).
6. (Optional) A webhook confirms `checkout.session.completed` to fulfil the donation.

### 5. Testing

Use Stripe **test mode** with these test cards:

| Card number | Result |
|-------------|--------|
| `4242 4242 4242 4242` | Payment succeeds |
| `4000 0025 0000 3155` | Requires 3D Secure authentication |
| `4000 0000 0000 9995` | Payment is declined (insufficient funds) |

Use any future expiry date, any 3-digit CVC, and any postal code.

### 6. Next steps

- (Optional) Use fixed Price IDs instead of the dynamic amount — see the note in "Values to Replace".
- Add a webhook handler to record completed donations and update the goal total globally
  (the goal currently reads from `SITE_CONFIG.raised` in `src/lib/donations.ts`).
- Switch `mode` to `subscription` if you want recurring donations, and re-add
  `payment_method_collection: "always"`.

### Resources

- Stripe support: https://support.stripe.com
- Stripe docs: https://docs.stripe.com
- Stripe MCP: https://docs.stripe.com/mcp
