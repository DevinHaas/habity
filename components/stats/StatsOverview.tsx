"use client";

import { motion } from "framer-motion";
import { Flame, CheckCircle2, Coins } from "lucide-react";
import Image from "next/image";

interface StatsOverviewProps {
  totalHabitsCompleted: number;
  currentStreak: number;
  coins: number;
}

export function StatsOverview({
  totalHabitsCompleted,
  currentStreak,
  coins,
}: StatsOverviewProps) {
  const stats = [
    {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      value: totalHabitsCompleted,
      label: "Habits Done",
      delay: 0.1,
    },
    {
      icon: <Flame className="w-5 h-5 text-orange-500" />,
      value: currentStreak,
      label: "Day Streak",
      delay: 0.2,
    },
    {
      icon: (
        <div className="relative w-5 h-5">
          <Image
            src="/coin.png"
            alt="Coins"
            fill
            className="object-contain"
          />
        </div>
      ),
      value: coins,
      label: "Coins",
      delay: 0.3,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-3 gap-2"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: stat.delay, duration: 0.3 }}
          className="flex flex-col items-center p-2.5 rounded-xl bg-card border border-border shadow-sm"
        >
          <div className="mb-1">{stat.icon}</div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: stat.delay + 0.2 }}
            className="text-lg font-bold text-foreground"
          >
            {stat.value}
          </motion.span>
          <span className="text-[10px] text-muted-foreground font-medium mt-0.5">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
