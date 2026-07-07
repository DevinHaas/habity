"use client";

import Link from "next/link";
import { Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/hooks/useCheckout";

interface GoalLimitGateProps {
  current: number;
  limit: number;
}

export function GoalLimitGate({ current, limit }: GoalLimitGateProps) {
  const { mutate: checkout, isPending } = useCheckout();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange/10">
        <Lock className="h-10 w-10 text-orange" />
      </div>
      <h2 className="mb-2 text-2xl font-extrabold text-foreground">
        Goal limit reached
      </h2>
      <p className="mb-1 text-muted-foreground">
        You&apos;re using <strong>{current}</strong> of <strong>{limit}</strong> goal{limit === 1 ? "" : "s"} on the Free plan.
      </p>
      <p className="mb-6 text-muted-foreground">
        Upgrade to <strong>Pro</strong> for unlimited goals.
      </p>
      <Button
        onClick={() => checkout({ tier: "pro", redirectPath: "/goals" })}
        disabled={isPending}
        className="rounded-full bg-orange text-white hover:bg-orange/90 px-8 font-semibold"
      >
        <Zap className="mr-2 h-4 w-4" />
        {isPending ? "Redirecting…" : "Upgrade to Pro — $5/mo"}
      </Button>
      <p className="mt-2 text-xs text-muted-foreground">Cancel any time · Secure checkout via Polar</p>
      <Link href="/goals" className="mt-4 text-sm text-muted-foreground hover:underline">
        Back to goals
      </Link>
    </div>
  );
}
