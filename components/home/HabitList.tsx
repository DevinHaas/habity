"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { TimelineGroup } from "./TimelineGroup";
import { AllHabitsModal } from "@/components/shared/AllHabitsModal";
import { HabitForm } from "@/components/habits/HabitForm";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import type { Habit, TimeOfDay } from "@/hooks/useHabits";
import type { HabitFormValues } from "@/lib/validations/habit";

interface HabitListProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  onEditHabit: (id: string, data: Partial<Omit<Habit, "id" | "streak" | "completed">>) => void;
  onDeleteHabit: (id: string) => void;
  completedCount: number;
  totalCount: number;
}

const TIME_ORDER: TimeOfDay[] = ["morning", "day", "evening"];

export function HabitList({ 
  habits, 
  onToggleHabit, 
  onEditHabit,
  onDeleteHabit,
  completedCount, 
  totalCount 
}: HabitListProps) {
  const [showAllHabitsModal, setShowAllHabitsModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

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

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowAllHabitsModal(false);
  };

  const handleDeleteHabit = (id: string) => {
    onDeleteHabit(id);
  };

  const handleEditSubmit = (values: HabitFormValues) => {
    if (editingHabit) {
      onEditHabit(editingHabit.id, {
        name: values.name,
        icon: values.icon,
        duration: values.duration,
        color: values.color,
        repeatDays: values.repeatDays,
        timeOfDay: values.timeOfDay,
      });
      setEditingHabit(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Daily routine</h2>
          <button
            onClick={() => setShowAllHabitsModal(true)}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            See all
          </button>
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
              <a
                href="/add-habit"
                className="mt-2 inline-block text-primary font-medium hover:underline"
              >
                Add your first habit
              </a>
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
                  onEditHabit={handleEditHabit}
                  onDeleteHabit={handleDeleteHabit}
                  completedCount={completedCount}
                  totalCount={totalCount}
                />
              );
            })
          )}
        </motion.div>
      </div>

      {/* All Habits Modal */}
      <AllHabitsModal
        isOpen={showAllHabitsModal}
        onClose={() => setShowAllHabitsModal(false)}
        habits={habits}
        onEdit={handleEditHabit}
        onDelete={handleDeleteHabit}
      />

      {/* Edit Habit Drawer */}
      <Drawer open={!!editingHabit} onOpenChange={(open) => !open && setEditingHabit(null)}>
        <DrawerContent className="!max-h-[95vh]">
          <DrawerHeader className="text-left border-b border-border px-6 pb-4">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-xl font-bold">Edit Habit</DrawerTitle>
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

          {/* Form */}
          <div className="overflow-y-auto flex-1 px-6 py-4 pb-8">
            {editingHabit && (
              <HabitForm
                onSubmit={handleEditSubmit}
                onCancel={() => setEditingHabit(null)}
                isEditMode
                initialValues={{
                  name: editingHabit.name,
                  icon: editingHabit.icon,
                  duration: editingHabit.duration,
                  color: editingHabit.color,
                  repeatDays: editingHabit.repeatDays,
                  timeOfDay: editingHabit.timeOfDay,
                }}
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
