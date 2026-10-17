export const SITE_CONFIG = {
  name: "LordPipon",
  title: "Help LordPipon reach his goal",
  description:
    "Support the project. Every donation, no matter the size, makes a difference and helps push the goal forward.",
  goal: 100,
  currency: "USD",
};

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

export interface Donor {
  id: string;
  name: string;
  amount: number;
  message?: string;
  createdAt: string;
}

// Mask a string, keeping first and last char visible: "john" -> "j**n", "user@email.com" -> "u**@e***.com"
export function maskName(input: string): string {
  if (!input) return "Anonymous";
  const atIdx = input.indexOf("@");
  if (atIdx !== -1) {
    // email-like
    const [user, domain] = input.split("@");
    const maskedUser =
      user.length <= 2
        ? user[0] + "*"
        : user[0] + "*".repeat(user.length - 2) + user[user.length - 1];
    const dotIdx = domain.lastIndexOf(".");
    const domainName =
      dotIdx === -1
        ? domain
        : domain.slice(0, dotIdx);
    const tld = dotIdx === -1 ? "" : domain.slice(dotIdx);
    const maskedDomain =
      domainName.length <= 2
        ? domainName[0] + "*"
        : domainName[0] +
          "*".repeat(domainName.length - 2) +
          domainName[domainName.length - 1];
    return `${maskedUser}@${maskedDomain}${tld}`;
  }
  if (input.length <= 2) return input[0] + "*";
  return input[0] + "*".repeat(input.length - 2) + input[input.length - 1];
}

export const SEED_DONORS: Donor[] = [
  {
    id: "1",
    name: "anonymous",
    amount: 25,
    message: "Keep it up!",
    createdAt: "2026-10-01T12:00:00Z",
  },
  {
    id: "2",
    name: "friend@example.com",
    amount: 15,
    message: "Good luck with the project",
    createdAt: "2026-10-05T09:30:00Z",
  },
  {
    id: "3",
    name: "supporter",
    amount: 40,
    createdAt: "2026-10-12T18:45:00Z",
  },
];

export function getTotalRaised(donors: Donor[]): number {
  return donors.reduce((sum, d) => sum + d.amount, 0);
}
