"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Trophy, ChevronRight, Plus } from "lucide-react";
import { GoalCard } from "@/components/goals/GoalCard";
import { BottomNav, FloatingAddButton } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";
import { useGoals, type GoalWithProgress } from "@/hooks/useGoals";
import { useHabits } from "@/hooks";
import { Button } from "@/components/ui/button";

export default function GoalsPage() {
  const { goals, totalCoins, removeGoal } = useGoals();
  const { stats } = useHabits();

  const completedGoals = goals.filter((g: GoalWithProgress) => g.isCompleted);
  const activeGoals = goals.filter((g: GoalWithProgress) => !g.isCompleted);

  return (
    <div className="min-h-screen bg-card flex flex-col max-w-2xl mx-auto">
      {/* Hero Section with Background */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[280px] flex-shrink-0"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/archer_target.jpeg"
            alt="Goals Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Header with coins and streak - transparent variant for hero */}
        <Header
          coins={stats.coins}
          streak={stats.currentStreak}
          variant="transparent"
          className="absolute top-0 left-0 right-0"
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between mx-auto max-w-lg w-full px-6 pt-16 pb-12">
          {/* Title with backdrop blur */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="inline-flex flex-col items-center px-8 py-4 rounded-3xl backdrop-blur-md bg-black/30">
              <div className="flex items-center gap-3 mb-1">
                <Trophy className="w-6 h-6 text-amber-400" />
                <span className="text-2xl font-bold text-white drop-shadow-lg">
                  My Goals
                </span>
              </div>
              <span className="text-sm font-medium text-white/90">
                Rewards for your progress
              </span>
            </div>
          </motion.div>

          {/* Spacer for bottom roundness overlap */}
          <div className="h-4" />
        </div>
      </motion.section>

      {/* Main Content Container with rounded top */}
      <main className="flex-1 bg-card rounded-t-[2.5rem] -mt-8 relative z-20 pb-32">
        <div className="mx-auto max-w-lg px-6 pt-6">
          {/* Active Goals Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Active Goals
            </h2>
            {activeGoals.length > 3 && (
              <button className="flex items-center gap-1 text-sm text-primary hover:underline">
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {activeGoals.length === 0 ? (
            <div className="bg-card rounded-2xl p-8 text-center border border-border">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                No goals yet
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first goal and start working towards your reward!
              </p>
              <Link href="/add-goal">
                <Button className="rounded-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Goal
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeGoals.map((goal: GoalWithProgress, index: number) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  index={index}
                  onDelete={removeGoal}
                />
              ))}
            </div>
          )}
        </motion.section>

        {/* Completed Goals Section */}
        {completedGoals.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                🎉 Completed
              </h2>
              <span className="text-sm text-muted-foreground">
                {completedGoals.length} goal{completedGoals.length !== 1 && "s"}
              </span>
            </div>

            <div className="space-y-3">
              {completedGoals.map((goal: GoalWithProgress, index: number) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  index={index}
                  onDelete={removeGoal}
                />
              ))}
            </div>
          </motion.section>
        )}
        </div>
      </main>

      {/* Floating Add Goal Button */}
      <FloatingAddButton href="/add-goal" color="olive" />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
