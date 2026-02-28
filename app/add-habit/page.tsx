import { getUserTier } from "@/db/actions/subscriptions";
import { getHabits } from "@/db/actions/habits";
import { AddHabitContent } from "@/components/habits/AddHabitContent";
import { HabitLimitGate } from "@/components/habits/HabitLimitGate";

const FREE_HABIT_LIMIT = 3;

export default async function AddHabitPage() {
  const [tier, habits] = await Promise.all([getUserTier(), getHabits()]);
  const atLimit = tier === "free" && habits.length >= FREE_HABIT_LIMIT;

  if (atLimit) {
    return <HabitLimitGate current={habits.length} limit={FREE_HABIT_LIMIT} />;
  }

  return <AddHabitContent />;
}
