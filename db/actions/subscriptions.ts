"use server";

import { db } from "@/db";
import { subscriptions, type SubscriptionTier } from "@/db/schema";
import { getCurrentUserId } from "@/lib/auth-utils";
import { eq } from "drizzle-orm";

export async function getSubscription() {
  const userId = await getCurrentUserId();

  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  // No row = free tier
  return sub ?? { userId, tier: "free" as SubscriptionTier, status: "active" };
}

export async function getUserTier(): Promise<SubscriptionTier> {
  const sub = await getSubscription();

  // If subscription is not active (canceled / past_due) treat as free
  if (sub.status !== "active") return "free";
  return sub.tier as SubscriptionTier;
}

export async function upsertSubscriptionFromWebhook(data: {
  polarSubscriptionId: string;
  polarCustomerId: string;
  userId: string;
  tier: SubscriptionTier;
  status: string;
  currentPeriodEnd?: Date;
}) {
  await db
    .insert(subscriptions)
    .values({
      userId: data.userId,
      polarSubscriptionId: data.polarSubscriptionId,
      polarCustomerId: data.polarCustomerId,
      tier: data.tier,
      status: data.status,
      currentPeriodEnd: data.currentPeriodEnd,
    })
    .onConflictDoUpdate({
      target: subscriptions.userId,
      set: {
        polarSubscriptionId: data.polarSubscriptionId,
        polarCustomerId: data.polarCustomerId,
        tier: data.tier,
        status: data.status,
        currentPeriodEnd: data.currentPeriodEnd,
        updatedAt: new Date(),
      },
    });
}
