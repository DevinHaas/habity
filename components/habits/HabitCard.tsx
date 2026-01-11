"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFeedback } from "@/hooks";
import { Confetti } from "@/components/shared/Confetti";
import type { Habit } from "@/hooks/useHabits";

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  index?: number;
  completedCount: number;
  totalCount: number;
}

export function HabitCard({ habit, onToggle, index = 0, completedCount, totalCount }: HabitCardProps) {
  const { onHabitComplete } = useFeedback();
  const [showConfetti, setShowConfetti] = useState(false);

  const handleToggle = () => {
    if (!habit.completed) {
      // Check if this is the last habit being completed
      const isLastHabit = completedCount + 1 === totalCount;
      
      // Only play the normal habit complete sound if it's NOT the last habit
      // The success screen will play its own sound
      if (!isLastHabit) {
        onHabitComplete();
      }
      setShowConfetti(true);
    }
    onToggle(habit.id);
  };

  return (
    <>
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="flex items-center gap-2.5 rounded-xl bg-card p-2.5 shadow-sm"
      >
        {/* Checkbox */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleToggle}
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            habit.completed
              ? "border-success bg-success text-white"
              : "border-muted-foreground/30 hover:border-primary"
          )}
        >
          {habit.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <Check className="h-3 w-3" />
            </motion.div>
          )}
        </motion.button>

        {/* Icon */}
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg"
          style={{ backgroundColor: `${habit.color}20` }}
        >
          {habit.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "font-medium text-sm text-foreground truncate",
              habit.completed && "line-through opacity-60"
            )}
          >
            {habit.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            Streak {habit.streak} days
          </p>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-0.5 text-muted-foreground shrink-0">
          <Clock className="h-3 w-3" />
          <span className="text-xs">{habit.duration}</span>
        </div>
      </motion.div>
    </>
  );
}
