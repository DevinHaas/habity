"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteHabit,
  updateHabit,
  setHabitStatus,
  createHabit,
  reorderHabits,
  type HabitStatus,
} from "@/db/actions/habits";
import { incrementPoints } from "@/db/actions/stats";
import { queryKeys } from "@/lib/query-keys";
import type { habits, habitCompletions } from "@/db/schema";

type Habit = typeof habits.$inferSelect;
type HabitCompletion = typeof habitCompletions.$inferSelect;

export function useToggleHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      habitId,
      date,
      status,
    }: {
      habitId: string;
      date: string;
      status: HabitStatus;
    }) => {
      await setHabitStatus(habitId, date, status);
      if (status === "done") {
        await incrementPoints(10);
      }
    },
    onMutate: async ({ habitId, date, status }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.habits.completions(date),
      });

      const previousCompletions = queryClient.getQueryData<HabitCompletion[]>(
        queryKeys.habits.completions(date),
      );

      queryClient.setQueryData<HabitCompletion[]>(
        queryKeys.habits.completions(date),
        (old) => {
          const without = old?.filter((c) => c.habitId !== habitId) || [];
          if (status === "nothing") return without;
          return [
            ...without,
            {
              id: `temp-${Date.now()}`,
              habitId,
              completionDate: date,
              status,
              createdAt: new Date(),
            },
          ];
        },
      );

      return { previousCompletions };
    },
    onError: (_err, { date }, context) => {
      if (context?.previousCompletions) {
        queryClient.setQueryData(
          queryKeys.habits.completions(date),
          context.previousCompletions,
        );
      }
    },
    onSettled: (_data, _error, { date }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.habits.completions(date),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.habits.allCompletions,
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === "completions" &&
          query.queryKey[1] === "history",
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.all });
    },
  });
}

export function useAddHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHabit,
    onMutate: async (newHabit) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.habits.all });

      const previousHabits = queryClient.getQueryData<Habit[]>(
        queryKeys.habits.all,
      );

      // Optimistically add the habit
      queryClient.setQueryData<Habit[]>(queryKeys.habits.all, (old) => [
        ...(old || []),
        {
          ...newHabit,
          id: `temp-${Date.now()}`,
          createdAt: new Date(),
        } as Habit,
      ]);

      return { previousHabits };
    },
    onError: (_err, _newHabit, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(queryKeys.habits.all, context.previousHabits);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits.all });
    },
  });
}

export function useDeleteHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHabit,
    onMutate: async (habitId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.habits.all });

      const previousHabits = queryClient.getQueryData<Habit[]>(
        queryKeys.habits.all,
      );

      // Optimistically remove the habit
      queryClient.setQueryData<Habit[]>(
        queryKeys.habits.all,
        (old) => old?.filter((h) => h.id !== habitId) || [],
      );

      return { previousHabits };
    },
    onError: (_err, _habitId, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(queryKeys.habits.all, context.previousHabits);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits.all });
    },
  });
}

export function useUpdateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Habit, "id" | "createdAt">>;
    }) => updateHabit(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.habits.all });

      const previousHabits = queryClient.getQueryData<Habit[]>(
        queryKeys.habits.all,
      );

      // Optimistically update the habit
      queryClient.setQueryData<Habit[]>(
        queryKeys.habits.all,
        (old) => old?.map((h) => (h.id === id ? { ...h, ...data } : h)) || [],
      );

      return { previousHabits };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(queryKeys.habits.all, context.previousHabits);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits.all });
    },
  });
}

export function useReorderHabits() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orders: { id: string; sortOrder: number }[]) =>
      reorderHabits(orders),
    onMutate: async (orders) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.habits.all });

      const previousHabits = queryClient.getQueryData<Habit[]>(
        queryKeys.habits.all,
      );

      const sortOrderById = new Map(orders.map((o) => [o.id, o.sortOrder]));
      queryClient.setQueryData<Habit[]>(
        queryKeys.habits.all,
        (old) =>
          old
            ?.map((h) =>
              sortOrderById.has(h.id)
                ? { ...h, sortOrder: sortOrderById.get(h.id)! }
                : h,
            )
            .sort((a, b) => a.sortOrder - b.sortOrder) || [],
      );

      return { previousHabits };
    },
    onError: (_err, _orders, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(queryKeys.habits.all, context.previousHabits);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits.all });
    },
  });
}
