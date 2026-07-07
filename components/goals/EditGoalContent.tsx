"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { GoalForm } from "@/components/goals/GoalForm";
import { Header } from "@/components/layout/Header";
import { useGoals } from "@/hooks/useGoals";
import { useStatsData } from "@/hooks";
import type { GoalFormValues } from "@/lib/validations/goal";

export function EditGoalContent({ goalId }: { goalId: string }) {
  const router = useRouter();
  const { goals, updateGoal, isPending } = useGoals();
  const { stats } = useStatsData();

  const goal = goals.find((g) => g.id === goalId);

  const handleSubmit = (values: GoalFormValues) => {
    updateGoal(goalId, {
      name: values.name,
      category: values.category || "",
      imageUrl: values.imageUrl || undefined,
      criteriaType: values.criteriaType,
      targetValue: values.targetValue,
      habitId: values.habitId,
    });
    router.push("/goals");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header coins={stats.coins} streak={stats.currentStreak} />

      <div className="mx-auto max-w-lg px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Edit Goal</h1>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleCancel}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-6 w-6 text-muted-foreground" />
          </motion.button>
        </div>
      </div>

      <main className="mx-auto max-w-lg px-6 pb-8">
        {!isPending && !goal ? (
          <p className="text-center text-muted-foreground py-12">
            Goal not found.
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GoalForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              initialValues={goal}
              submitLabel="Save Changes"
            />
          </motion.div>
        )}
      </main>
    </div>
  );
}
