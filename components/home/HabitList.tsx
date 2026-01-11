"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HabitCard } from "@/components/habits/HabitCard";
import type { Habit } from "@/hooks/useHabits";

interface HabitListProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
}

export function HabitList({ habits, onToggleHabit }: HabitListProps) {
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
        className="space-y-3"
      >
        {habits.length === 0 ? (
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
          habits.map((habit, index) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={onToggleHabit}
              index={index}
            />
          ))
        )}
      </motion.div>
    </div>
  );
}
