"use client";

import { useQuery } from "@tanstack/react-query";
import { getSubscription } from "@/db/actions/subscriptions";

export const subscriptionQueryKey = ["subscription"] as const;

export function useSubscription() {
  return useQuery({
    queryKey: subscriptionQueryKey,
    queryFn: getSubscription,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });
}
