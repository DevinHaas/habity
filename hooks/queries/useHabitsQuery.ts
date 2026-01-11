'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getHabits,
  getCompletionsForDate,
  getCompletionHistory,
  getAllCompletions,
} from '@/db/actions/habits';
import { queryKeys } from '@/lib/query-keys';

export function useHabitsQuery() {
  return useQuery({
    queryKey: queryKeys.habits.all,
    queryFn: () => getHabits(),
  });
}

export function useCompletionsQuery(date: string) {
  return useQuery({
    queryKey: queryKeys.habits.completions(date),
    queryFn: () => getCompletionsForDate(date),
  });
}

export function useCompletionHistoryQuery(days: number = 30) {
  return useQuery({
    queryKey: queryKeys.habits.history(days),
    queryFn: () => getCompletionHistory(days),
  });
}

export function useAllCompletionsQuery() {
  return useQuery({
    queryKey: queryKeys.habits.allCompletions,
    queryFn: () => getAllCompletions(),
  });
}
