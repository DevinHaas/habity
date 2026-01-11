"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { GoalForm } from "@/components/goals/GoalForm";
import { Header } from "@/components/layout/Header";
import { useGoals } from "@/hooks/useGoals";
import { useHabits } from "@/hooks";
import type { GoalFormValues } from "@/lib/validations/goal";

export default function AddGoalPage() {
  const router = useRouter();
  const { addGoal } = useGoals();
  const { stats } = useHabits();

  const handleSubmit = (values: GoalFormValues) => {
    addGoal({
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
      {/* Global Header with coins and streak */}
      <Header coins={stats.coins} streak={stats.currentStreak} />

      {/* Page Header */}
      <div className="mx-auto max-w-lg px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">New Goal</h1>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleCancel}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-6 w-6 text-muted-foreground" />
          </motion.button>
        </div>
      </div>

      {/* Form */}
      <main className="mx-auto max-w-lg px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GoalForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </motion.div>
      </main>
    </div>
  );
}
