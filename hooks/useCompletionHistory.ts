"use client";

import { useMemo } from "react";
import { useAllCompletionsQuery } from "./queries/useHabitsQuery";
import { useHabitsData } from "./useHabitsData";
import {
  formatLocalDate,
  type DayCompletion,
  type HabitCompletion,
} from "@/lib/habits-utils";

export function useCompletionHistory() {
  const { dbHabits } = useHabitsData();
  const { data: allCompletions = [] } = useAllCompletionsQuery();

  const completionHistory = useMemo((): DayCompletion[] => {
    const grouped = new Map<string, HabitCompletion[]>();

    allCompletions.forEach((completion) => {
      const date = completion.completionDate;
      const habit = dbHabits.find((h) => h.id === completion.habitId);

      if (!grouped.has(date)) {
        grouped.set(date, []);
      }

      grouped.get(date)!.push({
        habitId: completion.habitId,
        habitName: habit?.name || "Unknown",
        color: habit?.color || "#888",
        status: (completion.status ?? "done") as HabitCompletion["status"],
      });
    });

    return Array.from(grouped.entries())
      .map(([date, completions]) => ({ date, completions }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allCompletions, dbHabits]);

  function getCompletionsForDate(date: Date): HabitCompletion[] {
    const dateStr = formatLocalDate(date);
    const dayCompletion = completionHistory.find((d) => d.date === dateStr);
    return dayCompletion?.completions || [];
  }

  return { completionHistory, getCompletionsForDate };
}
