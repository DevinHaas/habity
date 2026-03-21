import type { habitCompletions } from "@/db/schema";

export type TimeOfDay = "morning" | "day" | "evening";

type DbCompletion = typeof habitCompletions.$inferSelect;

export interface Habit {
  id: string;
  name: string;
  icon: string;
  streak: number;
  duration: string;
  completed: boolean;
  color: string;
  repeatDays: number[];
  timeOfDay: TimeOfDay;
}

export interface HabitCompletion {
  habitId: string;
  habitName: string;
  color: string;
}

export interface DayCompletion {
  date: string;
  completions: HabitCompletion[];
}

export interface UserStats {
  level: number;
  points: number;
  totalPoints: number;
  currentBadge: number;
  coins: number;
  totalHabitsCompleted: number;
  currentStreak: number;
  habits: { name: string; progress: number; color: string }[];
}

export const LEVEL_NAMES: Record<number, string> = {
  1: "Seedling",
  2: "Sproutling",
  3: "Sapling",
  4: "Young Tree",
  5: "Blooming Tree",
  6: "Grove",
  7: "Woodland",
  8: "Sanctuary",
  9: "Kingdom",
  10: "Master",
};

export function getLevelName(level: number): string {
  if (level > 10) {
    return LEVEL_NAMES[10];
  }
  return LEVEL_NAMES[level] || LEVEL_NAMES[1];
}

export function getLevelProgress(points: number, totalPoints: number): number {
  return Math.min((points / totalPoints) * 100, 100);
}

// Format date to YYYY-MM-DD in LOCAL timezone (not UTC)
export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayString(): string {
  return formatLocalDate(new Date());
}

export function calculateStreak(
  habitId: string,
  completions: DbCompletion[]
): number {
  const habitCompletions = completions
    .filter((c) => c.habitId === habitId)
    .map((c) => c.completionDate)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (habitCompletions.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < habitCompletions.length; i++) {
    const completionDate = new Date(habitCompletions[i]);
    completionDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    if (completionDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else if (
      i === 0 &&
      completionDate.getTime() === expectedDate.getTime() - 86400000
    ) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (completionDate.getTime() === yesterday.getTime()) {
        streak++;
      }
    } else {
      break;
    }
  }

  return streak;
}

export function calculateCurrentStreak(completions: DbCompletion[]): number {
  const uniqueDates = [
    ...new Set(completions.map((c) => c.completionDate)),
  ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (uniqueDates.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < uniqueDates.length; i++) {
    const completionDate = new Date(uniqueDates[i]);
    completionDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    if (i === 0) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (
        completionDate.getTime() === today.getTime() ||
        completionDate.getTime() === yesterday.getTime()
      ) {
        streak++;
        if (completionDate.getTime() === yesterday.getTime()) {
          today.setDate(today.getDate() - 1);
        }
        continue;
      } else {
        break;
      }
    }

    if (completionDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
