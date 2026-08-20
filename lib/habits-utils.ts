import type { habitCompletions } from "@/db/schema";

export type TimeOfDay = "morning" | "day" | "evening";
export type HabitStatus = "done" | "failed" | "nothing";

type DbCompletion = typeof habitCompletions.$inferSelect & { status: string };

export interface Habit {
  id: string;
  name: string;
  icon: string;
  streak: number;
  duration: string;
  completed: boolean; // true when status === 'done'
  status: HabitStatus;
  color: string;
  repeatDays: number[];
  timeOfDay: TimeOfDay;
  sortOrder: number;
  createdAt: string;
}

export interface HabitCompletion {
  habitId: string;
  habitName: string;
  color: string;
  status: HabitStatus;
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

export function isHabitActiveOnDate(habit: { createdAt: string }, date: Date): boolean {
  return formatLocalDate(new Date(habit.createdAt)) <= formatLocalDate(date);
}

export function calculateStreak(
  habitId: string,
  completions: DbCompletion[]
): number {
  const logs = new Map<string, string>();
  completions
    .filter((c) => c.habitId === habitId)
    .forEach((c) => logs.set(c.completionDate, c.status ?? "done"));

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // done = count, failed = stop, nothing (no row) = skip
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatLocalDate(d);
    const status = logs.get(dateStr) ?? "nothing";

    if (status === "done") {
      streak++;
    } else if (status === "failed") {
      break;
    }
    // nothing → skip (don't break streak)
  }

  return streak;
}

export function calculateCurrentStreak(completions: DbCompletion[]): number {
  // Build a map: date → has any 'done'
  const doneDates = new Set(
    completions.filter((c) => (c.status ?? "done") === "done").map((c) => c.completionDate)
  );
  const failedOnlyDates = new Set(
    completions
      .filter((c) => c.status === "failed" && !doneDates.has(c.completionDate))
      .map((c) => c.completionDate)
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // done = count, failed-only = stop, nothing = skip
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatLocalDate(d);

    if (doneDates.has(dateStr)) {
      streak++;
    } else if (failedOnlyDates.has(dateStr)) {
      break;
    }
    // nothing → skip
  }

  return streak;
}
