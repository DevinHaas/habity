import { Suspense } from "react";
import { getSubscription } from "@/db/actions/subscriptions";
import { PricingCards } from "@/components/pricing/PricingCards";
import type { SubscriptionTier } from "@/db/schema";

async function PricingContent() {
  const sub = await getSubscription();

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold font-cinzel title-pro">
          Choose Your Path
        </h1>
        <p className="mt-2 text-muted-foreground font-body text-lg">
          Unlock the full Habity experience and reach your goals faster.
        </p>
      </div>

      <PricingCards
        currentTier={(sub.tier ?? "free") as SubscriptionTier}
        hasPolarCustomer={!!sub.polarCustomerId}
      />
    </main>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>}>
        <PricingContent />
      </Suspense>
    </div>
  );
}
