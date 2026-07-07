"use client";

import { useMemo } from "react";
import {
  useHabitsQuery,
  useCompletionsQuery,
  useCompletionHistoryQuery,
} from "./queries/useHabitsQuery";
import {
  calculateStreak,
  getTodayString,
  type Habit,
  type TimeOfDay,
} from "@/lib/habits-utils";

export function useHabitsData() {
  const todayString = getTodayString();
  const { data: dbHabits = [], isPending } = useHabitsQuery();
  const { data: todayCompletions = [] } = useCompletionsQuery(todayString);
  const { data: completionHistory = [] } = useCompletionHistoryQuery(30);

  const habits = useMemo((): Habit[] => {
    return dbHabits.map((dbHabit) => {
      const todayLog = todayCompletions.find((c) => c.habitId === dbHabit.id);
      const status = (todayLog?.status ?? "nothing") as Habit["status"];
      return {
        id: dbHabit.id,
        name: dbHabit.name,
        icon: dbHabit.icon,
        duration: dbHabit.duration || "5 min",
        color: dbHabit.color,
        repeatDays: dbHabit.repeatDays,
        timeOfDay: ((dbHabit.timeOfDay as TimeOfDay) || "morning") as TimeOfDay,
        status,
        completed: status === "done",
        streak: calculateStreak(dbHabit.id, completionHistory),
      };
    });
  }, [dbHabits, todayCompletions, completionHistory]);

  return { habits, dbHabits, isPending };
}
