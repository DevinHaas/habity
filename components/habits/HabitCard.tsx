"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, PanInfo } from "framer-motion";
import { Clock, Check, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFeedback } from "@/hooks";
import { Confetti } from "@/components/shared/Confetti";
import type { Habit } from "@/hooks/useHabits";

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onEdit?: (habit: Habit) => void;
  onDelete?: (id: string) => void;
  index?: number;
  completedCount: number;
  totalCount: number;
}

const SWIPE_THRESHOLD = 80;
const ACTION_WIDTH = 120;

export function HabitCard({ 
  habit, 
  onToggle, 
  onEdit,
  onDelete,
  index = 0, 
  completedCount, 
  totalCount 
}: HabitCardProps) {
  const { onHabitComplete } = useFeedback();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const x = useMotionValue(0);
  const constraintsRef = useRef(null);

  // Transform for action buttons opacity
  const actionsOpacity = useTransform(x, [-ACTION_WIDTH, -40, 0], [1, 0.5, 0]);

  const handleToggle = () => {
    if (!habit.completed) {
      const isLastHabit = completedCount + 1 === totalCount;
      if (!isLastHabit) {
        onHabitComplete();
      }
      setShowConfetti(true);
    }
    onToggle(habit.id);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const shouldOpen = info.offset.x < -SWIPE_THRESHOLD;
    
    if (shouldOpen) {
      animate(x, -ACTION_WIDTH, { type: "spring", stiffness: 400, damping: 30 });
      setIsOpen(true);
    } else {
      animate(x, 0, { type: "spring", stiffness: 400, damping: 30 });
      setIsOpen(false);
    }
  };

  const closeActions = () => {
    animate(x, 0, { type: "spring", stiffness: 400, damping: 30 });
    setIsOpen(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeActions();
    onEdit?.(habit);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeActions();
    onDelete?.(habit.id);
  };

  return (
    <>
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      {/* Entrance animation wrapper */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
      >
        <div ref={constraintsRef} className="relative overflow-hidden rounded-xl">
          {/* Action buttons (behind the card) */}
          <motion.div 
            className="absolute right-0 top-0 bottom-0 flex items-center rounded-r-xl overflow-hidden"
            style={{ opacity: actionsOpacity }}
          >
            <motion.button
              onClick={handleEdit}
              className="flex h-full w-[60px] items-center justify-center text-white rounded-r-xl"
              style={{ backgroundColor: 'var(--edit-action)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Pencil className="h-5 w-5" />
            </motion.button>
            <motion.button
              onClick={handleDelete}
              className="flex h-full w-[60px] items-center justify-center text-white rounded-r-xl"
              style={{ backgroundColor: 'var(--delete-action)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="h-5 w-5" />
            </motion.button>
          </motion.div>

          {/* Swipeable card */}
          <motion.div
            style={{ x }}
            drag="x"
            dragConstraints={{ left: -ACTION_WIDTH, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            className="flex items-center gap-2.5 rounded-xl bg-card p-2.5 shadow-sm relative z-10 cursor-grab active:cursor-grabbing touch-pan-y"
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

          {/* Overlay to close actions when tapping outside */}
          {isOpen && (
            <div 
              className="absolute inset-0 z-20" 
              onClick={closeActions}
              style={{ left: 0, right: ACTION_WIDTH }}
            />
          )}
        </div>
      </motion.div>
    </>
  );
}
