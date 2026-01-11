'use server';

import { db } from '@/db';
import { goals } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getGoals() {
  return db.select().from(goals).orderBy(goals.createdAt);
}

export async function createGoal(data: typeof goals.$inferInsert) {
  const [goal] = await db.insert(goals).values(data).returning();
  return goal;
}

export async function updateGoal(
  id: string,
  data: Partial<Omit<typeof goals.$inferInsert, 'id' | 'createdAt'>>
) {
  const [goal] = await db
    .update(goals)
    .set(data)
    .where(eq(goals.id, id))
    .returning();
  return goal;
}

export async function deleteGoal(id: string) {
  await db.delete(goals).where(eq(goals.id, id));
}
