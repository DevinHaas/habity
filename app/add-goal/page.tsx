import { getUserTier } from "@/db/actions/subscriptions";
import { getGoals } from "@/db/actions/goals";
import { AddGoalContent } from "@/components/goals/AddGoalContent";
import { GoalLimitGate } from "@/components/goals/GoalLimitGate";

const FREE_GOAL_LIMIT = 1;

export default async function AddGoalPage() {
  const [tier, goals] = await Promise.all([getUserTier(), getGoals()]);
  const atLimit = tier === "free" && goals.length >= FREE_GOAL_LIMIT;

  if (atLimit) {
    return <GoalLimitGate current={goals.length} limit={FREE_GOAL_LIMIT} />;
  }

  return <AddGoalContent />;
}
