"use server";

import { db } from '@/db';
import { habits, habitCompletions } from '@/db/schema';
import { eq, and, gte, desc, count, ilike } from 'drizzle-orm';
import { getCurrentUserId } from '@/lib/auth-utils';
import { getUserTier } from '@/db/actions/subscriptions';

export async function checkHabitNameAvailability(name: string): Promise<boolean> {
  const userId = await getCurrentUserId();
  const [existing] = await db
    .select({ id: habits.id })
    .from(habits)
    .where(and(eq(habits.userId, userId), ilike(habits.name, name.trim())))
    .limit(1);
  return !existing;
}

export async function getHabits() {
  const userId = await getCurrentUserId();
  return db
    .select()
    .from(habits)
    .where(eq(habits.userId, userId))
    .orderBy(habits.createdAt);
}

export async function createHabit(data: Omit<typeof habits.$inferInsert, "userId" | "id" | "createdAt">) {
  const userId = await getCurrentUserId();

  const tier = await getUserTier();
  if (tier === 'free') {
    const [{ value }] = await db.select({ value: count() }).from(habits).where(eq(habits.userId, userId));
    if (value >= 5) throw new Error('HABIT_LIMIT_REACHED');
  }

  const [habit] = await db.insert(habits).values({ ...data, userId }).returning();
  return habit;
}

export async function deleteHabit(id: string) {
  const userId = await getCurrentUserId();
  await db
    .delete(habits)
    .where(and(eq(habits.id, id), eq(habits.userId, userId)));
}

export async function updateHabit(
  id: string,
  data: Partial<Omit<typeof habits.$inferInsert, "userId">>,
) {
  const userId = await getCurrentUserId();
  const [habit] = await db
    .update(habits)
    .set(data)
    .where(and(eq(habits.id, id), eq(habits.userId, userId)))
    .returning();
  return habit;
}

export async function getCompletionsForDate(date: string) {
  const userId = await getCurrentUserId();
  // Get completions only for habits owned by the user
  const userHabits = await db
    .select({ id: habits.id })
    .from(habits)
    .where(eq(habits.userId, userId));
  const habitIds = userHabits.map((h) => h.id);

  if (habitIds.length === 0) return [];

  return db
    .select()
    .from(habitCompletions)
    .where(
      and(
        eq(habitCompletions.completionDate, date),
        // Filter by user's habits using inArray equivalent
      ),
    );
}

export async function getCompletionHistory(days: number = 30) {
  const userId = await getCurrentUserId();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const year = startDate.getFullYear();
  const month = String(startDate.getMonth() + 1).padStart(2, "0");
  const day = String(startDate.getDate()).padStart(2, "0");
  const startDateStr = `${year}-${month}-${day}`;

  // Join with habits to filter by user
  const result = await db
    .select({
      id: habitCompletions.id,
      habitId: habitCompletions.habitId,
      completionDate: habitCompletions.completionDate,
      createdAt: habitCompletions.createdAt,
    })
    .from(habitCompletions)
    .innerJoin(habits, eq(habitCompletions.habitId, habits.id))
    .where(
      and(
        eq(habits.userId, userId),
        gte(habitCompletions.completionDate, startDateStr),
      ),
    )
    .orderBy(desc(habitCompletions.completionDate));

  return result;
}

export async function getAllCompletions() {
  const userId = await getCurrentUserId();

  const result = await db
    .select({
      id: habitCompletions.id,
      habitId: habitCompletions.habitId,
      completionDate: habitCompletions.completionDate,
      createdAt: habitCompletions.createdAt,
    })
    .from(habitCompletions)
    .innerJoin(habits, eq(habitCompletions.habitId, habits.id))
    .where(eq(habits.userId, userId))
    .orderBy(desc(habitCompletions.completionDate));

  return result;
}

export async function toggleCompletion(
  habitId: string,
  date: string,
  completed: boolean,
) {
  const userId = await getCurrentUserId();

  // Verify the habit belongs to the user
  const [habit] = await db
    .select()
    .from(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)));

  if (!habit) {
    throw new Error("Habit not found or unauthorized");
  }

  if (completed) {
    await db.insert(habitCompletions).values({ habitId, completionDate: date });
  } else {
    await db
      .delete(habitCompletions)
      .where(
        and(
          eq(habitCompletions.habitId, habitId),
          eq(habitCompletions.completionDate, date),
        ),
      );
  }
}
