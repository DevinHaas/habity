import { Suspense } from "react";
import { PricingCards } from "@/components/pricing/PricingCards";
import { BottomNav } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";
import { getStats } from "@/db/actions/stats";

async function PricingContent() {
  const stats = await getStats();

  return (
    <>
      <Header coins={stats.coins} streak={0} />
      <main className="mx-auto max-w-2xl px-4 pb-32 pt-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-foreground">
            Choose your plan
          </h1>
          <p className="mt-2 text-muted-foreground">
            Unlock the full Habity experience and reach your goals faster.
          </p>
        </div>

        <PricingCards />
      </main>
      <BottomNav />
    </>
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
