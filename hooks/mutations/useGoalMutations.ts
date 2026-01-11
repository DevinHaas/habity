'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createGoal, updateGoal, deleteGoal } from '@/db/actions/goals';
import { queryKeys } from '@/lib/query-keys';
import type { goals } from '@/db/schema';

type Goal = typeof goals.$inferSelect;

export function useAddGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGoal,
    onMutate: async (newGoal) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.goals.all });

      const previousGoals = queryClient.getQueryData<Goal[]>(
        queryKeys.goals.all
      );

      // Optimistically add the goal
      queryClient.setQueryData<Goal[]>(queryKeys.goals.all, (old) => [
        ...(old || []),
        {
          ...newGoal,
          id: `temp-${Date.now()}`,
          createdAt: new Date(),
        } as Goal,
      ]);

      return { previousGoals };
    },
    onError: (_err, _newGoal, context) => {
      if (context?.previousGoals) {
        queryClient.setQueryData(queryKeys.goals.all, context.previousGoals);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Goal> }) =>
      updateGoal(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.goals.all });

      const previousGoals = queryClient.getQueryData<Goal[]>(
        queryKeys.goals.all
      );

      // Optimistically update the goal
      queryClient.setQueryData<Goal[]>(queryKeys.goals.all, (old) =>
        old?.map((g) => (g.id === id ? { ...g, ...data } : g)) || []
      );

      return { previousGoals };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousGoals) {
        queryClient.setQueryData(queryKeys.goals.all, context.previousGoals);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGoal,
    onMutate: async (goalId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.goals.all });

      const previousGoals = queryClient.getQueryData<Goal[]>(
        queryKeys.goals.all
      );

      // Optimistically remove the goal
      queryClient.setQueryData<Goal[]>(queryKeys.goals.all, (old) =>
        old?.filter((g) => g.id !== goalId) || []
      );

      return { previousGoals };
    },
    onError: (_err, _goalId, context) => {
      if (context?.previousGoals) {
        queryClient.setQueryData(queryKeys.goals.all, context.previousGoals);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
    },
  });
}
