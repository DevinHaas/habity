'use client';

import { useQuery } from '@tanstack/react-query';
import { getGoals } from '@/db/actions/goals';
import { queryKeys } from '@/lib/query-keys';

export function useGoalsQuery() {
  return useQuery({
    queryKey: queryKeys.goals.all,
    queryFn: () => getGoals(),
  });
}
