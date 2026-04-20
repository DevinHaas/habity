"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { SubscriptionTier } from "@/db/schema";

type CheckoutArgs = { tier: SubscriptionTier; redirectPath?: string };

async function createCheckout({ tier, redirectPath }: CheckoutArgs): Promise<void> {
  if (tier === "free") return;

  const res = await fetch("/api/polar/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tier, redirectPath }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to create checkout");
  }

  const { url } = await res.json();
  window.location.href = url;
}

export function useCheckout() {
  return useMutation({
    mutationFn: createCheckout,
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    },
  });
}
