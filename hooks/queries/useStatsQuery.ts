'use client';

import { useQuery } from '@tanstack/react-query';
import { getStats } from '@/db/actions/stats';
import { queryKeys } from '@/lib/query-keys';

export function useStatsQuery() {
  return useQuery({
    queryKey: queryKeys.stats.all,
    queryFn: () => getStats(),
  });
}
