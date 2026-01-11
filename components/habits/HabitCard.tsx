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
}

export function HabitCard({ habit, onToggle, index = 0 }: HabitCardProps) {
  const { onHabitComplete } = useFeedback();
  const [showConfetti, setShowConfetti] = useState(false);

  const handleToggle = () => {
    if (!habit.completed) {
      onHabitComplete();
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
        className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-sm"
      >
        {/* Checkbox */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleToggle}
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
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
              <Check className="h-4 w-4" />
            </motion.div>
          )}
        </motion.button>

        {/* Icon */}
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
          style={{ backgroundColor: `${habit.color}20` }}
        >
          {habit.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "font-semibold text-foreground truncate",
              habit.completed && "line-through opacity-60"
            )}
          >
            {habit.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            Streak {habit.streak} days
          </p>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-1 text-muted-foreground shrink-0">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{habit.duration}</span>
        </div>
      </motion.div>
    </>
  );
}
