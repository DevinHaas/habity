"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Trophy, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/hooks/useCheckout";
import { useSubscriptionQuery } from "@/hooks/queries/useSubscriptionQuery";
import { getEffectiveTier } from "@/lib/subscription-utils";

type UpgradePromptProps = {
  title?: string;
  message?: string;
  verifying?: boolean;
};

export function UpgradePrompt({
  title = "Pro Feature",
  message = "Upgrade to Pro to unlock this feature and track your long-term progress.",
  verifying = false,
}: UpgradePromptProps) {
  const { mutate: checkout, isPending } = useCheckout();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange/10">
        <Lock className="h-10 w-10 text-orange" />
      </div>
      <h2 className="mb-2 text-2xl font-extrabold text-foreground">{title}</h2>
      <p className="mb-6 max-w-xs text-muted-foreground">{message}</p>
      {verifying ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Verifying payment…</span>
        </div>
      ) : (
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
      )}
      <p className="mt-4 text-xs text-muted-foreground">
        Cancel any time · Secure checkout via Polar
      </p>
    </div>
  );
}

export function ProGate({
  children,
  hasPro,
}: {
  children: React.ReactNode;
  hasPro: boolean;
}) {
  if (hasPro) return <>{children}</>;
  return <UpgradePrompt />;
}

function ClientProGateInner({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isCheckoutSuccess = searchParams.get("success") === "true";

  const { data: sub, isLoading } = useSubscriptionQuery({ pollUntilActive: isCheckoutSuccess });
  const tier = getEffectiveTier(sub ?? null);
  const isPro = tier === "pro";

  useEffect(() => {
    if (isCheckoutSuccess && isPro) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("success");
      const qs = params.size ? `?${params}` : "";
      router.replace(`${pathname}${qs}`);
    }
  }, [isCheckoutSuccess, isPro, pathname, router, searchParams]);

  if (isLoading) return <>{fallback ?? null}</>;
  if (isPro) return <>{children}</>;
  return <UpgradePrompt verifying={isCheckoutSuccess} />;
}

export function ClientProGate({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return <ClientProGateInner fallback={fallback}>{children}</ClientProGateInner>;
}
