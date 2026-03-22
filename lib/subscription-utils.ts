import type { SubscriptionTier } from "@/db/schema";

/** Returns the effective tier for a subscription row.
 *  Both "active" and "trialing" grant paid-tier access. */
export function getEffectiveTier(
  sub: { status: string; tier: string } | null | undefined
): SubscriptionTier {
  if (!sub) return "free";
  if (sub.status === "active" || sub.status === "trialing") {
    return sub.tier as SubscriptionTier;
  }
  return "free";
}
