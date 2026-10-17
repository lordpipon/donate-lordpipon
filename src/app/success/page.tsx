import Link from "next/link";
import { CheckCircle2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Thank you! — Donate to LordPipon",
};

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-secondary/40 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="items-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Thank you!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-balance text-muted-foreground">
            Your donation went through successfully. It genuinely helps reach the
            goal — you&apos;re awesome.
          </p>
          <div className="flex items-center justify-center gap-2 text-primary">
            <Heart className="h-5 w-5" fill="currentColor" />
            <span className="font-medium">LordPipon</span>
          </div>
          <Button asChild className="w-full">
            <Link href="/">Back to donations</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
