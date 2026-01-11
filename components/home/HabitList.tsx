"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TimelineGroup } from "./TimelineGroup";
import type { Habit, TimeOfDay } from "@/hooks/useHabits";

interface HabitListProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  completedCount: number;
  totalCount: number;
}

const TIME_ORDER: TimeOfDay[] = ["morning", "day", "evening"];

export function HabitList({ habits, onToggleHabit, completedCount, totalCount }: HabitListProps) {
  // Group habits by time of day
  const groupedHabits = useMemo(() => {
    const groups: Record<TimeOfDay, Habit[]> = {
      morning: [],
      day: [],
      evening: [],
    };
    
    habits.forEach(habit => {
      const timeOfDay = habit.timeOfDay || "morning";
      groups[timeOfDay].push(habit);
    });
    
    return groups;
  }, [habits]);

  const hasAnyHabits = habits.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Daily routine</h2>
        <Link
          href="/stats"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          See all
        </Link>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {!hasAnyHabits ? (
          <div className="rounded-2xl bg-card p-8 text-center">
            <p className="text-muted-foreground">No habits for today</p>
            <Link
              href="/add-habit"
              className="mt-2 inline-block text-primary font-medium hover:underline"
            >
              Add your first habit
            </Link>
          </div>
        ) : (
          TIME_ORDER.map((timeOfDay) => {
            const habitsForTime = groupedHabits[timeOfDay];
            if (habitsForTime.length === 0) return null;
            
            return (
              <TimelineGroup
                key={timeOfDay}
                timeOfDay={timeOfDay}
                habits={habitsForTime}
                onToggleHabit={onToggleHabit}
                completedCount={completedCount}
                totalCount={totalCount}
              />
            );
          })
        )}
      </motion.div>
    </div>
  );
}
