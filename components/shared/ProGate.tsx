"use client";

import { Trophy, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { useCheckout } from "@/hooks/useCheckout";

export function ProGate({ children }: { children: React.ReactNode }) {
  const { data: sub, isLoading } = useSubscription();
  const { mutate: checkout, isPending } = useCheckout();
  const hasPro =
    sub?.tier === "pro" &&
    (sub?.status === "active" || sub?.status === "trialing");

  if (isLoading) return null;
  if (hasPro) return <>{children}</>;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange/10">
        <Lock className="h-10 w-10 text-orange" />
      </div>
      <h2 className="mb-2 text-2xl font-extrabold text-foreground">
        Pro Feature
      </h2>
      <p className="mb-6 max-w-xs text-muted-foreground">
        Goals are available on the <strong>Pro</strong> plan and above. Upgrade
        to set milestones and track your long-term progress.
      </p>
      <Button
        onClick={() =>
          checkout({ tier: "pro", redirectPath: window.location.pathname })
        }
        disabled={isPending}
        className="rounded-full bg-orange text-white hover:bg-orange/90 px-8 font-semibold"
      >
        <Trophy className="mr-2 h-4 w-4" />
        {isPending ? "Redirecting…" : "Upgrade to Pro — $5/mo"}
      </Button>
      <p className="mt-4 text-xs text-muted-foreground">
        Cancel any time · Secure checkout via Polar
      </p>
    </div>
  );
}
