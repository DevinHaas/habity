import { Webhooks } from "@polar-sh/nextjs";
import { upsertSubscriptionFromWebhook } from "@/db/actions/subscriptions";
import type { SubscriptionTier } from "@/db/schema";

const PRO_PRODUCT_ID = process.env.POLAR_PRO_PRODUCT_ID!;

function getTierFromProductId(productId: string): SubscriptionTier {
  if (productId === PRO_PRODUCT_ID) return "pro";
  return "free";
}

function getUserIdFromSub(sub: {
  customer: { externalId?: string | null };
  metadata?: Record<string, unknown> | null;
}): string | undefined {
  return (
    sub.customer.externalId ?? (sub.metadata?.userId as string | undefined)
  );
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => {
    const type = payload.type;

    if (
      type === "subscription.created" ||
      type === "subscription.active" ||
      type === "subscription.updated"
    ) {
      const sub = payload.data;

      const userId = getUserIdFromSub(sub);

      if (!userId) {
        return;
      }

      const tier = getTierFromProductId(sub.productId);

      await upsertSubscriptionFromWebhook({
        polarSubscriptionId: sub.id,
        polarCustomerId: sub.customerId,
        userId,
        tier,
        status: sub.status === "active" ? "active" : sub.status,
        currentPeriodEnd: sub.currentPeriodEnd ?? undefined,
      });
    }

    if (type === "subscription.canceled") {
      const sub = payload.data;
      const userId = getUserIdFromSub(sub);
      if (!userId) return;

      // Canceled — keep access until period end, but mark as canceled
      await upsertSubscriptionFromWebhook({
        polarSubscriptionId: sub.id,
        polarCustomerId: sub.customerId,
        userId,
        tier: getTierFromProductId(sub.productId),
        status: "canceled",
        currentPeriodEnd: sub.currentPeriodEnd ?? undefined,
      });
    }

    if (type === "subscription.revoked") {
      const sub = payload.data;
      const userId = getUserIdFromSub(sub);
      if (!userId) return;

      // Revoked — remove access immediately, downgrade to free
      await upsertSubscriptionFromWebhook({
        polarSubscriptionId: sub.id,
        polarCustomerId: sub.customerId,
        userId,
        tier: "free",
        status: "revoked",
        currentPeriodEnd: undefined,
      });
    }
  },
});
