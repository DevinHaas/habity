'use client';

import { useSubscriptionQuery } from '@/hooks/queries/useSubscriptionQuery';
import { useHabitsQuery } from '@/hooks/queries/useHabitsQuery';
import { UpgradePrompt } from '@/components/shared/ProGate';
import { AddHabitContent } from '@/components/habits/AddHabitContent';
import { getEffectiveTier } from '@/lib/subscription-utils';

export function AddHabitGate() {
  const { data: sub, isLoading: subLoading } = useSubscriptionQuery();
  const { data: habits, isLoading: habitsLoading } = useHabitsQuery();

  if (subLoading || habitsLoading) return null;

  const tier = getEffectiveTier(sub);

  if (tier === 'free' && (habits?.length ?? 0) >= 5) {
    return (
      <UpgradePrompt
        title="Habit limit reached"
        message="Free plan includes 5 habits. Upgrade to Pro for unlimited habits."
      />
    );
  }

  return <AddHabitContent />;
}
