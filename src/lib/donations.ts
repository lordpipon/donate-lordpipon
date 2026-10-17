export const SITE_CONFIG = {
  name: "LordPipon",
  title: "Help LordPipon reach his goal",
  description:
    "Support the project. Every donation, no matter the size, makes a difference and helps push the goal forward.",
  goal: 100,
  raised: 0,
  currency: "USD",
};

export const DONATION_AMOUNTS = {
  presets: [5, 10, 25, 50],
  min: 1,
  max: 1000,
  default: 10,
} as const;

export const PAYMENT_METHODS = {
  stripe: {
    enabled: true,
    // Checkout is created server-side at /api/create-checkout-session
  },
  kofi: {
    enabled: true,
    url: "https://ko-fi.com/piponidlo",
  },
  crypto: {
    enabled: true,
    label: "Bitcoin",
    address: "bc1q8u83tpwkhedlf8xqkccd5yvnyruqahegqv5xdw",
    network: "Bitcoin (BTC)",
  },
} as const;
