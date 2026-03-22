import { Webhooks } from "@polar-sh/nextjs";
import type { NextRequest } from "next/server";
import { upsertSubscriptionFromWebhook } from "@/db/actions/subscriptions";
import type { SubscriptionTier } from "@/db/schema";

const PRO_PRODUCT_ID = process.env.POLAR_PRO_PRODUCT_ID!;

function getTierFromProductId(productId: string): SubscriptionTier {
  if (productId === PRO_PRODUCT_ID) return "pro";
  console.log(`[Polar Webhook] Unknown productId "${productId}", PRO_PRODUCT_ID="${PRO_PRODUCT_ID}" → defaulting to free`);
  return "free";
}

function getUserIdFromSub(sub: {
  customer: { externalId?: string | null };
  metadata?: Record<string, unknown> | null;
}): string | undefined {
  const fromExternalId = sub.customer.externalId ?? undefined;
  const fromMetadata = sub.metadata?.userId as string | undefined;
  console.log(`[Polar Webhook] getUserId: externalId="${fromExternalId}", metadata.userId="${fromMetadata}"`);
  return fromExternalId ?? fromMetadata;
}

const webhookHandler = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => {
    const type = payload.type;
    console.log(`[Polar Webhook] ✅ Received event type="${type}"`);

    try {
      if (
        type === "subscription.created" ||
        type === "subscription.active" ||
        type === "subscription.updated"
      ) {
        const sub = payload.data;
        console.log(`[Polar Webhook] Sub id="${sub.id}" customerId="${sub.customerId}" productId="${sub.productId}" status="${sub.status}"`);
        console.log(`[Polar Webhook] Sub customer:`, JSON.stringify(sub.customer));
        console.log(`[Polar Webhook] Sub metadata:`, JSON.stringify(sub.metadata));

        const userId = getUserIdFromSub(sub);

        if (!userId) {
          console.error("[Polar Webhook] ❌ No userId found — cannot upsert subscription. Sub id:", sub.id);
          return;
        }

        const tier = getTierFromProductId(sub.productId);
        console.log(`[Polar Webhook] Upserting: userId="${userId}" tier="${tier}" status="${sub.status}"`);

        await upsertSubscriptionFromWebhook({
          polarSubscriptionId: sub.id,
          polarCustomerId: sub.customerId,
          userId,
          tier,
          status: sub.status === "active" ? "active" : sub.status,
          currentPeriodEnd: sub.currentPeriodEnd ?? undefined,
        });

        console.log(`[Polar Webhook] ✅ Upserted subscription for userId="${userId}"`);
      }

      if (type === "subscription.canceled") {
        const sub = payload.data;
        const userId = getUserIdFromSub(sub);
        if (!userId) {
          console.error("[Polar Webhook] ❌ No userId for canceled sub", sub.id);
          return;
        }

        console.log(`[Polar Webhook] Marking canceled: userId="${userId}"`);
        await upsertSubscriptionFromWebhook({
          polarSubscriptionId: sub.id,
          polarCustomerId: sub.customerId,
          userId,
          tier: getTierFromProductId(sub.productId),
          status: "canceled",
          currentPeriodEnd: sub.currentPeriodEnd ?? undefined,
        });
        console.log(`[Polar Webhook] ✅ Marked canceled for userId="${userId}"`);
      }

      if (type === "subscription.revoked") {
        const sub = payload.data;
        const userId = getUserIdFromSub(sub);
        if (!userId) {
          console.error("[Polar Webhook] ❌ No userId for revoked sub", sub.id);
          return;
        }

        console.log(`[Polar Webhook] Revoking: userId="${userId}"`);
        await upsertSubscriptionFromWebhook({
          polarSubscriptionId: sub.id,
          polarCustomerId: sub.customerId,
          userId,
          tier: "free",
          status: "revoked",
          currentPeriodEnd: undefined,
        });
        console.log(`[Polar Webhook] ✅ Revoked for userId="${userId}"`);
      }
    } catch (err) {
      console.error("[Polar Webhook] ❌ Error processing payload:", err);
      throw err; // re-throw so Polar retries
    }
  },
});

export async function POST(req: NextRequest) {
  console.log(`[Polar Webhook] ⬇️  Incoming POST — url="${req.url}" secret configured: ${!!process.env.POLAR_WEBHOOK_SECRET}`);
  console.log(`[Polar Webhook] Headers: webhook-id="${req.headers.get("webhook-id")}" webhook-signature="${req.headers.get("webhook-signature") ? "present" : "missing"}"`);
  const res = await webhookHandler(req);
  console.log(`[Polar Webhook] ↩️  Response status: ${res.status}`);
  if (res.status === 403) {
    console.error("[Polar Webhook] ❌ 403 — signature verification failed. Check POLAR_WEBHOOK_SECRET matches the Polar dashboard.");
  }
  return res;
}
