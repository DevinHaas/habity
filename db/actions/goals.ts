'use server';

import { db } from '@/db';
import { goals } from '@/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { getCurrentUserId } from '@/lib/auth-utils';
import { getUserTier } from '@/db/actions/subscriptions';

export async function getGoals() {
  const userId = await getCurrentUserId();
  return db.select().from(goals).where(eq(goals.userId, userId)).orderBy(goals.createdAt);
}

export async function createGoal(data: Omit<typeof goals.$inferInsert, 'userId'>) {
  const userId = await getCurrentUserId();

  const tier = await getUserTier();
  if (tier === 'free') {
    const [{ value }] = await db.select({ value: count() }).from(goals).where(eq(goals.userId, userId));
    if (value >= 1) throw new Error('GOAL_LIMIT_REACHED');
  }

  const [goal] = await db.insert(goals).values({ ...data, userId }).returning();
  return goal;
}

export async function updateGoal(
  id: string,
  data: Partial<Omit<typeof goals.$inferInsert, 'id' | 'createdAt' | 'userId'>>
) {
  const userId = await getCurrentUserId();
  const [goal] = await db
    .update(goals)
    .set(data)
    .where(and(eq(goals.id, id), eq(goals.userId, userId)))
    .returning();
  return goal;
}

export async function deleteGoal(id: string) {
  const userId = await getCurrentUserId();
  await db.delete(goals).where(and(eq(goals.id, id), eq(goals.userId, userId)));
}
