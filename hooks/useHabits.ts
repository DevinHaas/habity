"use client";

import { useCallback, useMemo } from "react";
import { useHabitsQuery, useCompletionsQuery, useCompletionHistoryQuery } from "./queries/useHabitsQuery";
import { useStatsQuery } from "./queries/useStatsQuery";
import { useToggleHabit, useAddHabit, useDeleteHabit } from "./mutations/useHabitMutations";
import type { habits as habitsTable, habitCompletions, userStats } from "@/db/schema";

export type TimeOfDay = "morning" | "day" | "evening";

// Database types
type DbHabit = typeof habitsTable.$inferSelect;
type DbCompletion = typeof habitCompletions.$inferSelect;
type DbStats = typeof userStats.$inferSelect;

// Frontend types (with computed fields)
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

// Level names mapping
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

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

function calculateStreak(
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
    } else if (i === 0 && completionDate.getTime() === expectedDate.getTime() - 86400000) {
      // If the most recent completion is yesterday, that's okay - start counting from there
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

function calculateCurrentStreak(completions: DbCompletion[]): number {
  const uniqueDates = [...new Set(completions.map((c) => c.completionDate))].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  if (uniqueDates.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < uniqueDates.length; i++) {
    const completionDate = new Date(uniqueDates[i]);
    completionDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    // Allow for today or yesterday as the start
    if (i === 0) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (
        completionDate.getTime() === today.getTime() ||
        completionDate.getTime() === yesterday.getTime()
      ) {
        streak++;
        if (completionDate.getTime() === yesterday.getTime()) {
          // Adjust expected date for subsequent iterations
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

export function useHabits() {
  const todayString = getTodayString();

  // Queries
  const { data: dbHabits = [], isPending: isHabitsLoading } = useHabitsQuery();
  const { data: todayCompletions = [] } = useCompletionsQuery(todayString);
  const { data: completionHistory = [] } = useCompletionHistoryQuery(30);
  const { data: dbStats } = useStatsQuery();

  // Mutations
  const toggleMutation = useToggleHabit();
  const addMutation = useAddHabit();
  const deleteMutation = useDeleteHabit();

  // Transform DB habits to frontend habits with completion status and streaks
  const habits = useMemo((): Habit[] => {
    return dbHabits.map((dbHabit) => ({
      id: dbHabit.id,
      name: dbHabit.name,
      icon: dbHabit.icon,
      duration: dbHabit.duration || "5 min",
      color: dbHabit.color,
      repeatDays: dbHabit.repeatDays,
      timeOfDay: (dbHabit.timeOfDay as TimeOfDay) || "morning",
      completed: todayCompletions.some((c) => c.habitId === dbHabit.id),
      streak: calculateStreak(dbHabit.id, completionHistory),
    }));
  }, [dbHabits, todayCompletions, completionHistory]);

  // Transform DB stats to frontend stats
  const stats = useMemo((): UserStats => {
    if (!dbStats) {
      return {
        level: 1,
        points: 0,
        totalPoints: 150,
        currentBadge: 1,
        coins: 0,
        totalHabitsCompleted: 0,
        currentStreak: 0,
        habits: [],
      };
    }

    return {
      level: dbStats.level,
      points: dbStats.points,
      totalPoints: dbStats.totalPoints,
      currentBadge: dbStats.currentBadge,
      coins: dbStats.coins,
      totalHabitsCompleted: dbStats.totalHabitsCompleted,
      currentStreak: calculateCurrentStreak(completionHistory),
      habits: habits.map((h) => ({
        name: h.name,
        progress: Math.min((h.streak / 30) * 100, 100),
        color: h.color,
      })),
    };
  }, [dbStats, completionHistory, habits]);

  // Group completions by date for calendar view
  const completionHistoryByDate = useMemo((): DayCompletion[] => {
    const grouped = new Map<string, HabitCompletion[]>();

    completionHistory.forEach((completion) => {
      const date = completion.completionDate;
      const habit = dbHabits.find((h) => h.id === completion.habitId);

      if (!grouped.has(date)) {
        grouped.set(date, []);
      }

      grouped.get(date)!.push({
        habitId: completion.habitId,
        habitName: habit?.name || "Unknown",
        color: habit?.color || "#888",
      });
    });

    return Array.from(grouped.entries())
      .map(([date, completions]) => ({ date, completions }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [completionHistory, dbHabits]);

  const toggleHabit = useCallback(
    (id: string) => {
      const habit = habits.find((h) => h.id === id);
      if (!habit) return;

      toggleMutation.mutate({
        habitId: id,
        date: todayString,
        completed: !habit.completed,
      });
    },
    [habits, toggleMutation, todayString]
  );

  const addHabit = useCallback(
    (habit: Omit<Habit, "id" | "streak" | "completed">) => {
      addMutation.mutate({
        name: habit.name,
        icon: habit.icon,
        duration: habit.duration,
        color: habit.color,
        repeatDays: habit.repeatDays,
        timeOfDay: habit.timeOfDay,
      });
    },
    [addMutation]
  );

  const removeHabit = useCallback(
    (id: string) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation]
  );

  const getHabitsForDay = useCallback(
    (dayOfWeek: number) => {
      return habits.filter((habit) => habit.repeatDays.includes(dayOfWeek));
    },
    [habits]
  );

  const getTodayHabits = useCallback(() => {
    const today = new Date().getDay();
    const adjustedDay = today === 0 ? 6 : today - 1;
    return getHabitsForDay(adjustedDay);
  }, [getHabitsForDay]);

  const getCompletedCount = useCallback(() => {
    return habits.filter((h) => h.completed).length;
  }, [habits]);

  const getTotalCount = useCallback(() => {
    return habits.length;
  }, [habits]);

  const getCompletionsForDate = useCallback(
    (date: Date): HabitCompletion[] => {
      const dateStr = date.toISOString().split("T")[0];
      const dayCompletion = completionHistoryByDate.find((d) => d.date === dateStr);
      return dayCompletion?.completions || [];
    },
    [completionHistoryByDate]
  );

  const levelName = getLevelName(stats.level);

  return {
    habits,
    stats,
    completionHistory: completionHistoryByDate,
    levelName,
    isPending: isHabitsLoading,
    toggleHabit,
    addHabit,
    removeHabit,
    getHabitsForDay,
    getTodayHabits,
    getCompletedCount,
    getTotalCount,
    getCompletionsForDate,
  };
}
