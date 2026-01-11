"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { ProgressBars } from "@/components/stats/ProgressBars";
import { PointsCard } from "@/components/stats/PointsCard";
import { BadgeDisplay } from "@/components/stats/BadgeDisplay";
import { TimePeriodSelector } from "@/components/stats/TimePeriodSelector";
import { BottomNav } from "@/components/layout/BottomNav";
import { useHabits } from "@/hooks";

type TimePeriod = "weekly" | "monthly" | "yearly";

export default function StatsPage() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("weekly");
  const { stats } = useHabits();

  // Mock data that would change based on time period
  const getStatsForPeriod = (period: TimePeriod) => {
    const multipliers = {
      weekly: 1,
      monthly: 4,
      yearly: 52,
    };
    const m = multipliers[period];

    return {
      points: stats.points * m,
      post: `${440 * m} lb`,
      forestArea: `${200 * m} ft²`,
      time: period === "weekly" ? "7h 30m" : period === "monthly" ? "30h" : "365h",
    };
  };

  const periodStats = getStatsForPeriod(timePeriod);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg safe-area-top"
      >
        <div className="mx-auto max-w-lg px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Your progress
              </h1>
              <p className="text-lg text-foreground">and insights</p>
            </div>
            <Link href="/">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors"
              >
                <X className="h-6 w-6 text-muted-foreground" />
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-6 space-y-8">
        {/* Time Period Selector */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TimePeriodSelector
            selected={timePeriod}
            onSelect={setTimePeriod}
          />
        </motion.section>

        {/* Progress Bars */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ProgressBars habits={stats.habits} />
        </motion.section>

        {/* Points Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <PointsCard
            points={periodStats.points}
            stats={{
              post: periodStats.post,
              forestArea: periodStats.forestArea,
              time: periodStats.time,
            }}
          />
        </motion.section>

        {/* Badge Display */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pb-8"
        >
          <BadgeDisplay
            currentLevel={stats.level}
            currentBadge={stats.currentBadge}
            totalPoints={stats.totalPoints}
            pointsToNextLevel={stats.totalPoints - stats.points}
          />
        </motion.section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
