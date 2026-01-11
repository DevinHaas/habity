'use server';

import { db } from '@/db';
import { userStats } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUserId } from '@/lib/auth-utils';

export async function getStats() {
  const userId = await getCurrentUserId();
  const stats = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);

  // If no stats exist for this user, create default stats
  if (stats.length === 0) {
    const [newStats] = await db
      .insert(userStats)
      .values({
        userId,
        level: 1,
        points: 0,
        totalPoints: 150,
        currentBadge: 1,
        coins: 0,
        totalHabitsCompleted: 0,
      })
      .returning();
    return newStats;
  }

  return stats[0];
}

export async function updateStats(
  data: Partial<Omit<typeof userStats.$inferInsert, 'userId' | 'createdAt'>>
) {
  const userId = await getCurrentUserId();
  const currentStats = await getStats();
  const [updated] = await db
    .update(userStats)
    .set(data)
    .where(eq(userStats.userId, currentStats.userId))
    .returning();
  return updated;
}

export async function incrementPoints(amount: number) {
  const userId = await getCurrentUserId();
  const currentStats = await getStats();
  const newPoints = currentStats.points + amount;
  const newCoins = currentStats.coins + amount;
  const newTotalCompleted = currentStats.totalHabitsCompleted + 1;

  // Check for level up
  let newLevel = currentStats.level;
  let newTotalPoints = currentStats.totalPoints;
  let remainingPoints = newPoints;

  while (remainingPoints >= newTotalPoints) {
    remainingPoints -= newTotalPoints;
    newLevel += 1;
    newTotalPoints = Math.floor(newTotalPoints * 1.5); // Increase points needed for next level
  }

  const [updated] = await db
    .update(userStats)
    .set({
      points: remainingPoints,
      totalPoints: newTotalPoints,
      level: newLevel,
      coins: newCoins,
      totalHabitsCompleted: newTotalCompleted,
    })
    .where(eq(userStats.userId, userId))
    .returning();

  return updated;
}
