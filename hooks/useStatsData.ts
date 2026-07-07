"use client";

import { useMemo } from "react";
import { useStatsQuery } from "./queries/useStatsQuery";
import {
  useAllCompletionsQuery,
  useCompletionHistoryQuery,
} from "./queries/useHabitsQuery";
import { useHabitsData } from "./useHabitsData";
import {
  calculateCurrentStreak,
  getLevelName,
  type UserStats,
} from "@/lib/habits-utils";

export function useStatsData() {
  const { habits, dbHabits } = useHabitsData();
  const { data: dbStats, isPending: isStatsPending } = useStatsQuery();
  const { data: allCompletions = [] } = useAllCompletionsQuery();
  const { data: completionHistory = [] } = useCompletionHistoryQuery(30);

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
      habits: habits.map((h) => {
        const dbHabit = dbHabits.find((dbH) => dbH.id === h.id);
        let progress = 0;
        if (dbHabit?.createdAt) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const creationDate = new Date(dbHabit.createdAt);
          creationDate.setHours(0, 0, 0, 0);
          const daysSinceCreation = Math.max(
            1,
            Math.ceil(
              (today.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24)
            ) + 1
          );
          const completionCount = allCompletions.filter(
            (c) => c.habitId === h.id && (c.status ?? "done") === "done"
          ).length;
          progress = Math.min(
            (completionCount / daysSinceCreation) * 100,
            100
          );
        }
        return { name: h.name, progress, color: h.color };
      }),
    };
  }, [dbStats, completionHistory, habits, dbHabits, allCompletions]);

  const levelName = getLevelName(stats.level);

  return { stats, levelName, isPending: isStatsPending };
}
