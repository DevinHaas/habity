"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Pencil, Trash2, Sun, SunDim, Moon } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import type { Habit, TimeOfDay } from "@/hooks/useHabits";

interface AllHabitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  habits: Habit[];
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

const TIME_CONFIG: Record<TimeOfDay, { label: string; icon: typeof Sun; color: string }> = {
  morning: {
    label: "Morning",
    icon: Sun,
    color: "#F59E0B",
  },
  day: {
    label: "Day",
    icon: SunDim,
    color: "#10B981",
  },
  evening: {
    label: "Evening",
    icon: Moon,
    color: "#8B5CF6",
  },
};

export function AllHabitsModal({ isOpen, onClose, habits, onEdit, onDelete }: AllHabitsModalProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      onDelete(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
    }
  };

  const groupedHabits = habits.reduce((acc, habit) => {
    const timeOfDay = habit.timeOfDay || "morning";
    if (!acc[timeOfDay]) {
      acc[timeOfDay] = [];
    }
    acc[timeOfDay].push(habit);
    return acc;
  }, {} as Record<TimeOfDay, Habit[]>);

  const timeOrder: TimeOfDay[] = ["morning", "day", "evening"];

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="!max-h-[90vh]">
        <DrawerHeader className="text-left border-b border-border px-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-xl font-bold">All Habits</DrawerTitle>
              <DrawerDescription className="mt-1">
                {habits.length} habit{habits.length !== 1 ? "s" : ""} total
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors"
              >
                <X className="h-6 w-6 text-muted-foreground" />
              </motion.button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {habits.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No habits yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {timeOrder.map((timeOfDay) => {
                const habitsForTime = groupedHabits[timeOfDay];
                if (!habitsForTime || habitsForTime.length === 0) return null;

                const config = TIME_CONFIG[timeOfDay];
                const Icon = config.icon;

                return (
                  <div key={timeOfDay}>
                    {/* Time section header */}
                    <div className="flex items-center gap-2 mb-3">
                      <Icon 
                        className="h-4 w-4" 
                        style={{ color: config.color }}
                      />
                      <span className="text-sm font-medium text-foreground">
                        {config.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({habitsForTime.length})
                      </span>
                    </div>

                    {/* Habits list */}
                    <div className="space-y-2">
                      {habitsForTime.map((habit) => (
                        <motion.div
                          key={habit.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          className="flex items-center gap-3 p-3 rounded-xl bg-background"
                        >
                          {/* Icon */}
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl"
                            style={{ backgroundColor: `${habit.color}20` }}
                          >
                            {habit.icon}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm text-foreground truncate">
                              {habit.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {habit.duration} • {habit.streak} day streak
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onEdit(habit)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted transition-colors"
                            >
                              <Pencil className="h-4 w-4" style={{ color: 'var(--edit-action)' }} />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(habit.id)}
                              className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                                confirmDeleteId === habit.id
                                  ? "text-white"
                                  : "hover:bg-muted"
                              )}
                              style={confirmDeleteId === habit.id ? { backgroundColor: 'var(--delete-action)' } : undefined}
                            >
                              <Trash2 
                                className={cn(
                                  "h-4 w-4",
                                  confirmDeleteId === habit.id 
                                    ? "text-white" 
                                    : undefined
                                )}
                                style={confirmDeleteId === habit.id ? undefined : { color: 'var(--delete-action)' }}
                              />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Safe area for mobile */}
        <div className="h-8 bg-card shrink-0" />
      </DrawerContent>
    </Drawer>
  );
}
