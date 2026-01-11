'use server';

import { db } from '@/db';
import { habits, habitCompletions } from '@/db/schema';
import { eq, and, gte, desc } from 'drizzle-orm';

export async function getHabits() {
  return db.select().from(habits).orderBy(habits.createdAt);
}

export async function createHabit(data: typeof habits.$inferInsert) {
  const [habit] = await db.insert(habits).values(data).returning();
  return habit;
}

export async function deleteHabit(id: string) {
  await db.delete(habits).where(eq(habits.id, id));
}

export async function getCompletionsForDate(date: string) {
  return db
    .select()
    .from(habitCompletions)
    .where(eq(habitCompletions.completionDate, date));
}

export async function getCompletionHistory(days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];

  return db
    .select()
    .from(habitCompletions)
    .where(gte(habitCompletions.completionDate, startDateStr))
    .orderBy(desc(habitCompletions.completionDate));
}

export async function toggleCompletion(
  habitId: string,
  date: string,
  completed: boolean
) {
  if (completed) {
    await db.insert(habitCompletions).values({ habitId, completionDate: date });
  } else {
    await db
      .delete(habitCompletions)
      .where(
        and(
          eq(habitCompletions.habitId, habitId),
          eq(habitCompletions.completionDate, date)
        )
      );
  }
}
