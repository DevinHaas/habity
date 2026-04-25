"use client";

import { useSubscriptionQuery } from "@/hooks/queries/useSubscriptionQuery";
import { useGoalsQuery } from "@/hooks/queries/useGoalsQuery";
import { AddGoalContent } from "@/components/goals/AddGoalContent";
import { getEffectiveTier } from "@/lib/subscription-utils";
import { UpgradePrompt } from "../shared/ProGate";

export function AddGoalGate() {
  const { data: sub, isLoading: subLoading } = useSubscriptionQuery();
  const { data: goals, isLoading: goalsLoading } = useGoalsQuery();

  if (subLoading || goalsLoading) return null;

  const tier = getEffectiveTier(sub);

  if (tier === "free" && (goals?.length ?? 0) >= 1) {
    return (
      <UpgradePrompt
        title="Goal limit reached"
        message="Free plan includes 1 goal. Upgrade to Pro for unlimited goals."
      />
    );
  }

  return <AddGoalContent />;
}
