'use client';

import { useQuery } from '@tanstack/react-query';
import { getSubscription } from '@/db/actions/subscriptions';
import { queryKeys } from '@/lib/query-keys';

interface UseSubscriptionQueryOptions {
  /** Poll every 2s until the tier is non-free (active subscription). Auto-stops. */
  pollUntilActive?: boolean;
}

export function useSubscriptionQuery({ pollUntilActive = false }: UseSubscriptionQueryOptions = {}) {
  return useQuery({
    queryKey: queryKeys.subscription.all,
    queryFn: () => getSubscription(),
    refetchInterval: pollUntilActive
      ? (query) => {
          const data = query.state.data;
          // Stop polling once we see an active/trialing non-free subscription
          const isProvisioned =
            (data?.status === 'active' || data?.status === 'trialing') &&
            data?.tier !== 'free';
          if (isProvisioned) return false;
          return 2000;
        }
      : false,
  });
}
