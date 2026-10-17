"use client";

import { useState } from "react";
import {
  Heart,
  Target,
  CreditCard,
  Coffee,
  Wallet,
  Copy,
  Check,
  HandCoins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DONATION_AMOUNTS,
  PAYMENT_METHODS,
} from "@/lib/donations";

export default function DonatePage() {
  const [copied, setCopied] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [amount, setAmount] = useState<number>(DONATION_AMOUNTS.default);
  const [customAmount, setCustomAmount] = useState("");

  const totalRaised = SITE_CONFIG.raised;
  const progressPercent = Math.min((totalRaised / SITE_CONFIG.goal) * 100, 100);
  const goalReached = totalRaised >= SITE_CONFIG.goal;
  const remaining = Math.max(SITE_CONFIG.goal - totalRaised, 0);

  const effectiveAmount =
    customAmount !== "" ? Number(customAmount) : amount;
  const amountValid =
    Number.isFinite(effectiveAmount) &&
    effectiveAmount >= DONATION_AMOUNTS.min &&
    effectiveAmount <= DONATION_AMOUNTS.max;

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
    if (!amountValid) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: effectiveAmount }),
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
                ? "Goal reached — thank you!"
                : `$${remaining.toFixed(0)} left to reach the goal`}
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HandCoins className="h-5 w-5 text-primary" />
              Choose an amount
            </CardTitle>
            <CardDescription>
              Pick a preset or enter a custom amount
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {DONATION_AMOUNTS.presets.map((preset) => (
                <Button
                  key={preset}
                  variant={
                    customAmount === "" && amount === preset
                      ? "default"
                      : "outline"
                  }
                  onClick={() => {
                    setAmount(preset);
                    setCustomAmount("");
                  }}
                >
                  ${preset}
                </Button>
              ))}
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>
              <Input
                type="number"
                inputMode="decimal"
                min={DONATION_AMOUNTS.min}
                max={DONATION_AMOUNTS.max}
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="pl-7"
              />
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
                  disabled={checkoutLoading || !amountValid}
                >
                  {checkoutLoading
                    ? "Redirecting…"
                    : amountValid
                      ? `Donate $${effectiveAmount}`
                      : "Enter an amount"}
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
                <CardDescription>Support quickly via Ko-fi</CardDescription>
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
                Send crypto directly to the wallet below (
                {PAYMENT_METHODS.crypto.network})
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

        <footer className="text-center text-xs text-muted-foreground">
          Made with ❤️ by {SITE_CONFIG.name}
        </footer>
      </div>
    </main>
  );
}
