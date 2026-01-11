"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, CalendarDays } from "lucide-react";
import { LevelCard } from "@/components/stats/LevelCard";
import { StatsOverview } from "@/components/stats/StatsOverview";
import { ProgressBars } from "@/components/stats/ProgressBars";
import { TimePeriodSelector } from "@/components/stats/TimePeriodSelector";
import { HabitCalendar } from "@/components/stats/HabitCalendar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";
import { useHabits } from "@/hooks";
import { cn } from "@/lib/utils";

type TimePeriod = "weekly" | "monthly" | "yearly";
type AnalyticsView = "bars" | "calendar";

export default function StatsPage() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("weekly");
  const [analyticsView, setAnalyticsView] = useState<AnalyticsView>("calendar");
  const { stats, habits, levelName, getCompletionsForDate } = useHabits();

  // Get progress percentage based on time period
  const getProgressForPeriod = (period: TimePeriod) => {
    const baseProgress = {
      weekly: { overall: 72, habits: stats.habits },
      monthly: { overall: 68, habits: stats.habits },
      yearly: { overall: 75, habits: stats.habits },
    };
    return baseProgress[period];
  };

  const periodProgress = getProgressForPeriod(timePeriod);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Global Header with coins and streak */}
      <Header coins={stats.coins} streak={stats.currentStreak} />

      {/* Page Title */}
      <div className="mx-auto max-w-lg px-6 py-2">
        <h1 className="text-xl font-bold text-foreground">Your Profile</h1>
        <p className="text-xs text-muted-foreground">Track your growth</p>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-6 space-y-3">
        {/* Level Card - Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <LevelCard
            level={stats.level}
            levelName={levelName}
            currentBadge={stats.currentBadge}
            points={stats.points}
            totalPoints={stats.totalPoints}
          />
        </motion.section>

        {/* Stats Overview Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatsOverview
            totalHabitsCompleted={stats.totalHabitsCompleted}
            currentStreak={stats.currentStreak}
            coins={stats.coins}
          />
        </motion.section>

        {/* Analytics Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3 pb-8 flex flex-col min-h-[400px]"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Analytics</h2>
            
            {/* View Toggle */}
            <div className="flex rounded-xl bg-muted p-1">
              <button
                onClick={() => setAnalyticsView("bars")}
                className={cn(
                  "relative flex items-center justify-center rounded-lg px-3 py-1.5 transition-colors",
                  analyticsView === "bars"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {analyticsView === "bars" && (
                  <motion.div
                    layoutId="view-indicator"
                    className="absolute inset-0 bg-card rounded-lg shadow-sm"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}
                <BarChart3 className="h-4 w-4 relative z-10" />
              </button>
              <button
                onClick={() => setAnalyticsView("calendar")}
                className={cn(
                  "relative flex items-center justify-center rounded-lg px-3 py-1.5 transition-colors",
                  analyticsView === "calendar"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {analyticsView === "calendar" && (
                  <motion.div
                    layoutId="view-indicator"
                    className="absolute inset-0 bg-card rounded-lg shadow-sm"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}
                <CalendarDays className="h-4 w-4 relative z-10" />
              </button>
            </div>
          </div>
          
          {/* Time Period Selector */}
          <TimePeriodSelector
            selected={timePeriod}
            onSelect={setTimePeriod}
          />

          {/* Analytics Content */}
          <AnimatePresence mode="wait">
            {analyticsView === "bars" ? (
              <motion.div
                key="bars"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-h-0"
              >
                <ProgressBars habits={periodProgress.habits} />
              </motion.div>
            ) : (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <HabitCalendar
                  getCompletionsForDate={getCompletionsForDate}
                  totalHabits={habits.length}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
