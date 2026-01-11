'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createHabit,
  deleteHabit,
  toggleCompletion,
} from '@/db/actions/habits';
import { incrementPoints } from '@/db/actions/stats';
import { queryKeys } from '@/lib/query-keys';
import type { habits, habitCompletions } from '@/db/schema';

type Habit = typeof habits.$inferSelect;
type HabitCompletion = typeof habitCompletions.$inferSelect;

export function useToggleHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      habitId,
      date,
      completed,
    }: {
      habitId: string;
      date: string;
      completed: boolean;
    }) => {
      await toggleCompletion(habitId, date, completed);
      // Increment points when completing a habit
      if (completed) {
        await incrementPoints(10);
      }
    },
    onMutate: async ({ habitId, date, completed }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.habits.completions(date),
      });

      // Snapshot previous value
      const previousCompletions = queryClient.getQueryData<HabitCompletion[]>(
        queryKeys.habits.completions(date)
      );

      // Optimistically update
      queryClient.setQueryData<HabitCompletion[]>(
        queryKeys.habits.completions(date),
        (old) => {
          if (completed) {
            return [
              ...(old || []),
              {
                id: `temp-${Date.now()}`,
                habitId,
                completionDate: date,
                createdAt: new Date(),
              },
            ];
          }
          return old?.filter((c) => c.habitId !== habitId) || [];
        }
      );

      return { previousCompletions };
    },
    onError: (_err, { date }, context) => {
      // Rollback on error
      if (context?.previousCompletions) {
        queryClient.setQueryData(
          queryKeys.habits.completions(date),
          context.previousCompletions
        );
      }
    },
    onSettled: (_data, _error, { date }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: queryKeys.habits.completions(date),
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
        queryKeys.habits.all
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
        queryKeys.habits.all
      );

      // Optimistically remove the habit
      queryClient.setQueryData<Habit[]>(queryKeys.habits.all, (old) =>
        old?.filter((h) => h.id !== habitId) || []
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
