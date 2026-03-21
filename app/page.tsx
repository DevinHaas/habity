"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { HabitList } from "@/components/home/HabitList";
import { BottomNav, FloatingAddButton } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";
import { SuccessScreen } from "@/components/shared/SuccessScreen";
import { useHabitsData, useStatsData, useTimeOfDay, type Habit } from "@/hooks";
import {
  useToggleHabit,
  useUpdateHabit,
  useDeleteHabit,
} from "@/hooks/mutations/useHabitMutations";
import { getTodayString as getToday } from "@/lib/habits-utils";
import { toast } from "@/lib/ToastProvider";
import { useSoundEffects } from "@/hooks/useSoundEffects";

function getSuccessShownKey(): string {
  return `successShown_${getToday()}`;
}

export default function HomePage() {
  const { habits, isPending } = useHabitsData();
  const { stats } = useStatsData();
  const { isDay } = useTimeOfDay();
  const toggleMutation = useToggleHabit();
  const updateMutation = useUpdateHabit();
  const deleteMutation = useDeleteHabit();
  const { playCoin } = useSoundEffects();
  const todayString = getToday();

  const completedCount = habits.filter((h) => h.completed).length;
  const totalCount = habits.length;

  function toggleHabit(id: string) {
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;
    const wasCompleted = habit.completed;
    toggleMutation.mutate(
      { habitId: id, date: todayString, completed: !habit.completed },
      {
        onSuccess: () => {
          if (!wasCompleted) {
            playCoin();
            toast("+10 XP", { description: "Habit completed!" });
          }
        },
      },
    );
  }

  function updateHabit(
    id: string,
    habit: Partial<Omit<Habit, "id" | "streak" | "completed">>,
  ) {
    updateMutation.mutate({
      id,
      data: {
        name: habit.name,
        icon: habit.icon,
        duration: habit.duration,
        color: habit.color,
        repeatDays: habit.repeatDays,
        timeOfDay: habit.timeOfDay,
      },
    });
  }

  function removeHabit(id: string) {
    deleteMutation.mutate(id);
  }

  // Success screen state
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const previousAllCompletedRef = useRef(false);

  // Detect when all habits are completed
  useEffect(() => {
    const allCompleted = completedCount === totalCount && totalCount > 0;
    const successKey = getSuccessShownKey();
    const hasShownToday =
      typeof window !== "undefined" &&
      localStorage.getItem(successKey) === "true";

    // Only show success screen when transitioning from "not all completed" to "all completed"
    // and it hasn't been shown today
    if (allCompleted && !previousAllCompletedRef.current && !hasShownToday) {
      // Mark as shown in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(successKey, "true");
      }
      setShowSuccessScreen(true);
    }

    // Reset localStorage flag if not all habits are completed (allows re-triggering if user uncompletes and completes again)
    if (!allCompleted) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(successKey);
      }
    }

    // Track previous state to detect transitions
    previousAllCompletedRef.current = allCompleted;
  }, [completedCount, totalCount]);

  // Background image changes based on time of day
  const backgroundImage = isDay
    ? "/hero_background.jpeg"
    : "/hero_background_night.jpeg";

  return (
    <div className="min-h-screen bg-card flex flex-col max-w-2xl mx-auto">
      {/* Hero Section with Background */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[320px] flex-shrink-0"
      >
        {/* Background Image - No blur or overlay, changes with time of day */}
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt="Background"
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
          {/* Motivational text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="inline-flex flex-col items-center px-8 py-4 rounded-3xl backdrop-blur-md bg-white/15">
              <span className="text-2xl font-bold text-white drop-shadow-lg">
                Keep going! 🌟
              </span>
              <span className="text-sm font-medium text-white/90 mt-1">
                Build your habits, earn rewards
              </span>
            </div>
          </motion.div>

          {/* Spacer for bottom roundness overlap */}
          <div className="h-4" />
        </div>
      </motion.section>

      {/* Main Content Container with rounded top */}
      <main className="flex-1 bg-card rounded-t-[2.5rem] -mt-8 relative z-20 pb-24">
        <div className="mx-auto max-w-lg px-6 pt-6">
          {/* Habit List */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <HabitList
              habits={habits}
              isPending={isPending}
              onToggleHabit={toggleHabit}
              onEditHabit={updateHabit}
              onDeleteHabit={removeHabit}
              completedCount={completedCount}
              totalCount={totalCount}
            />
          </motion.section>
        </div>
      </main>

      {/* Floating Add Button - fixed above navbar but constrained to container width */}
      <div className="fixed bottom-24 left-0 right-0 z-40 pointer-events-none">
        <div className="mx-auto max-w-lg px-6">
          <div className="flex justify-end pointer-events-auto">
            <FloatingAddButton variant="relative" />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Success Screen - shown when all habits completed */}
      <SuccessScreen
        isVisible={showSuccessScreen}
        onClose={() => setShowSuccessScreen(false)}
      />
    </div>
  );
}
