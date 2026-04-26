"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, CalendarDays, Settings } from "lucide-react";
import { LevelCard } from "@/components/stats/LevelCard";
import { StatsOverview } from "@/components/stats/StatsOverview";
import { ProgressBars } from "@/components/stats/ProgressBars";
import { TimePeriodSelector } from "@/components/stats/TimePeriodSelector";
import { HabitCalendar } from "@/components/stats/HabitCalendar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";
import { SettingsModal } from "@/components/shared/SettingsModal";
import { Skeleton } from "@/components/ui/skeleton";
import { useHabitsData, useStatsData, useCompletionHistory } from "@/hooks";
import { useSubscription } from "@/hooks/useSubscription";
import { useSession } from "@/lib/auth-client";
import { getEffectiveTier } from "@/lib/subscription-utils";
import { cn } from "@/lib/utils";

type TimePeriod = "weekly" | "monthly" | "yearly";
type AnalyticsView = "bars" | "calendar";

function LevelCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1625] via-[#2d2640] to-[#1a1625] p-4 shadow-xl">
      {/* username placeholder */}
      <Skeleton className="absolute top-4 left-4 h-4 w-24 bg-white/10" />
      {/* crown placeholder */}
      <Skeleton className="absolute top-3 right-3 h-14 w-14 rounded-full bg-white/10" />
      <div className="flex flex-col items-center gap-2 py-2">
        {/* badge image */}
        <Skeleton className="h-16 w-16 rounded-full bg-white/10" />
        {/* level name */}
        <Skeleton className="h-5 w-28 bg-white/10" />
        {/* "Level N" */}
        <Skeleton className="h-4 w-16 bg-white/10" />
        {/* XP bar row */}
        <div className="w-full mt-1 space-y-1">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-6 bg-white/10" />
            <Skeleton className="h-3 w-14 bg-white/10" />
          </div>
          <Skeleton className="h-2 w-full rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

function StatsOverviewSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex flex-col items-center p-2.5 rounded-xl bg-card border border-border shadow-sm gap-1"
        >
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-10" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

export default function StatsPage() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("weekly");
  const [analyticsView, setAnalyticsView] = useState<AnalyticsView>("calendar");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { habits } = useHabitsData();
  const { stats, levelName, isPending: isStatsPending } = useStatsData();
  const { getCompletionsForDate } = useCompletionHistory();
  const { data: session } = useSession();
  const { data: subscription, isLoading: isSubscriptionLoading } =
    useSubscription();

  const isLoading = isStatsPending || isSubscriptionLoading;
  const tier = getEffectiveTier(subscription);

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
      <Header coins={stats.coins} streak={stats.currentStreak} />

      {/* Page Title */}
      <div className="mx-auto max-w-lg px-6 py-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Your Profile</h1>
            <p className="text-xs text-muted-foreground">Track your growth</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSettingsOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors"
            aria-label="Open settings"
          >
            <Settings className="h-5 w-5 text-muted-foreground" />
          </motion.button>
        </div>
      </div>

      <main className="mx-auto max-w-lg px-6 space-y-3">
        {/* Level Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {isLoading ? (
            <LevelCardSkeleton />
          ) : (
            <LevelCard
              level={stats.level}
              levelName={levelName}
              currentBadge={stats.currentBadge}
              points={stats.points}
              totalPoints={stats.totalPoints}
              userName={session?.user?.name}
              tier={tier}
            />
          )}
        </motion.section>

        {/* Analytics Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3 pb-8 flex flex-col min-h-[400px]"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              Analytics
            </h2>

            <div className="flex rounded-xl bg-muted p-1">
              <button
                onClick={() => setAnalyticsView("bars")}
                className={cn(
                  "relative flex items-center justify-center rounded-lg px-3 py-1.5 transition-colors",
                  analyticsView === "bars"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {analyticsView === "bars" && (
                  <motion.div
                    layoutId="view-indicator"
                    className="absolute inset-0 bg-card rounded-lg shadow-sm"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
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
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {analyticsView === "calendar" && (
                  <motion.div
                    layoutId="view-indicator"
                    className="absolute inset-0 bg-card rounded-lg shadow-sm"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <CalendarDays className="h-4 w-4 relative z-10" />
              </button>
            </div>
          </div>

          <TimePeriodSelector selected={timePeriod} onSelect={setTimePeriod} />

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
                  timePeriod={timePeriod}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </main>

      <BottomNav />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
