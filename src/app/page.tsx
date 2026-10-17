"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  Target,
  Users,
  CreditCard,
  Coffee,
  Wallet,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  SITE_CONFIG,
  PAYMENT_METHODS,
  SEED_DONORS,
  maskName,
  getTotalRaised,
  type Donor,
} from "@/lib/donations";

const STORAGE_KEY = "lp_donations_v1";

export default function DonatePage() {
  const [donors, setDonors] = useState<Donor[]>(SEED_DONORS);
  const [copied, setCopied] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved: Donor[] = JSON.parse(raw);
        if (Array.isArray(saved) && saved.length > 0) {
          setDonors(saved);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const totalRaised = getTotalRaised(donors);
  const progressPercent = Math.min(
    (totalRaised / SITE_CONFIG.goal) * 100,
    100
  );
  const goalReached = totalRaised >= SITE_CONFIG.goal;

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_METHODS.crypto.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const startStripeCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        setCheckoutLoading(false);
      }
    } catch {
      setCheckoutLoading(false);
    }
  };

  const recentDonors = [...donors]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 8);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/40">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-12 sm:py-20">
        <header className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Heart className="h-7 w-7 text-primary" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {SITE_CONFIG.title}
          </h1>
          <p className="mt-3 max-w-md text-balance text-muted-foreground">
            {SITE_CONFIG.description}
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Goal Progress
            </CardTitle>
            <CardDescription>
              {goalReached
                ? "Goal reached — thank you all!"
                : `$${SITE_CONFIG.goal - totalRaised > 0 ? (SITE_CONFIG.goal - totalRaised).toFixed(0) : 0} left to reach the goal`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progressPercent} className="h-3" />
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-primary">
                ${totalRaised.toFixed(2)} raised
              </span>
              <span className="text-muted-foreground">
                of ${SITE_CONFIG.goal} goal
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              {donors.length} {donors.length === 1 ? "donor" : "donors"} so far
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          {PAYMENT_METHODS.stripe.enabled && (
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Card / Stripe
                </CardTitle>
                <CardDescription>
                  Pay securely with credit or debit card
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={startStripeCheckout}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? "Redirecting…" : "Donate with Card"}
                </Button>
              </CardContent>
            </Card>
          )}

          {PAYMENT_METHODS.kofi.enabled && (
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Coffee className="h-5 w-5 text-primary" />
                  Ko-fi
                </CardTitle>
                <CardDescription>
                  Support quickly via Ko-fi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="secondary" className="w-full">
                  <a
                    href={PAYMENT_METHODS.kofi.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Donate on Ko-fi
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {PAYMENT_METHODS.crypto.enabled && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Wallet className="h-5 w-5 text-primary" />
                Crypto — {PAYMENT_METHODS.crypto.label}
              </CardTitle>
              <CardDescription>
                Send crypto directly to the wallet below ({PAYMENT_METHODS.crypto.network})
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3 font-mono text-sm">
                <span className="flex-1 truncate">
                  {PAYMENT_METHODS.crypto.address}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyAddress}
                  aria-label="Copy address"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Latest Donors
            </CardTitle>
            <CardDescription>
              Thank you to everyone who has contributed
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentDonors.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No donations yet. Be the first!
              </p>
            ) : (
              <ul className="divide-y">
                {recentDonors.map((donor) => (
                  <li
                    key={donor.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {maskName(donor.name)}
                      </p>
                      {donor.message && (
                        <p className="truncate text-xs text-muted-foreground">
                          &ldquo;{donor.message}&rdquo;
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-primary">
                      ${donor.amount.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <footer className="text-center text-xs text-muted-foreground">
          Made with ❤️ by {SITE_CONFIG.name}
        </footer>
      </div>
    </main>
  );
}
