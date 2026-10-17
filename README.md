# donate-lordpipon

Donation Website — support LordPipon's project.

A donation website built with Next.js, Tailwind CSS, shadcn/ui, and lucide-react.

**Live:** https://donate.lordpipon.com

## Features

- Dynamic goal progress bar ($100 goal, rises with donations)
- Latest donors list with half-masked usernames/emails
- Multiple payment options: Stripe, Ko-fi, Crypto (Proton wallet)
- Clean, responsive UI with shadcn/ui + lucide icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

Edit `src/lib/donations.ts` to set:

- `SITE_CONFIG.goal` — your fundraising goal
- `PAYMENT_METHODS.stripe.url` — your Stripe payment link
- `PAYMENT_METHODS.kofi.url` — your Ko-fi page URL
- `PAYMENT_METHODS.crypto.address` — your Proton wallet address

## Deploy

Deployed on Vercel at https://donate.lordpipon.com
