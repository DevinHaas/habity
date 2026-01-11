"use client";

import { motion } from "framer-motion";
import { Sun, SunDim, Moon } from "lucide-react";
import { HabitCard } from "@/components/habits/HabitCard";
import type { Habit, TimeOfDay } from "@/hooks/useHabits";

interface TimelineGroupProps {
  timeOfDay: TimeOfDay;
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (id: string) => void;
  completedCount: number;
  totalCount: number;
}

const TIME_CONFIG = {
  morning: {
    label: "Morning",
    icon: Sun,
    activeColor: "#F59E0B", // Warm amber for morning
    gradientFrom: "#FDE68A",
    gradientTo: "#F59E0B",
  },
  day: {
    label: "Day",
    icon: SunDim,
    activeColor: "#10B981", // Green for day
    gradientFrom: "#6EE7B7",
    gradientTo: "#10B981",
  },
  evening: {
    label: "Evening",
    icon: Moon,
    activeColor: "#8B5CF6", // Purple for evening
    gradientFrom: "#C4B5FD",
    gradientTo: "#8B5CF6",
  },
};

export function TimelineGroup({ 
  timeOfDay, 
  habits, 
  onToggleHabit, 
  onEditHabit,
  onDeleteHabit,
  completedCount, 
  totalCount 
}: TimelineGroupProps) {
  const config = TIME_CONFIG[timeOfDay];
  const Icon = config.icon;
  
  // Calculate how many habits are completed for this time group (for display in header)
  const groupCompletedCount = habits.filter(h => h.completed).length;
  const groupTotalCount = habits.length;
  
  if (groupTotalCount === 0) return null;

  return (
    <div className="mb-4">
      {/* Section Header */}
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold text-sm text-foreground">{config.label}</h3>
        <span className="text-xs text-muted-foreground">
          {groupCompletedCount}/{groupTotalCount}
        </span>
      </div>

      {/* Timeline with habits */}
      <div className="relative flex">
        {/* SVG Timeline Path */}
        <div className="absolute left-[10px] top-0 bottom-0 w-6">
          <svg
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`gradient-${timeOfDay}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={config.gradientFrom} />
                <stop offset="100%" stopColor={config.gradientTo} />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Habit Cards with Timeline Nodes */}
        <div className="flex-1 space-y-1.5">
          {habits.map((habit, index) => {
            const isCompleted = habit.completed;
            const isLast = index === habits.length - 1;
            
            return (
              <div key={habit.id} className="relative flex items-start">
                {/* Timeline Node and Connector */}
                <div className="relative z-10 flex flex-col items-center mr-2.5">
                  {/* Node Circle */}
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: isCompleted ? config.activeColor : "rgb(229 231 235)",
                      scale: isCompleted ? 1 : 0.85,
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-2.5 h-2.5 rounded-full border-2 border-background shadow-sm mt-4"
                    style={{
                      boxShadow: isCompleted ? `0 0 6px ${config.activeColor}40` : "none",
                    }}
                  />
                  
                  {/* Connector Line */}
                  {!isLast && (
                    <motion.div
                      initial={false}
                      animate={{
                        background: isCompleted 
                          ? `linear-gradient(to bottom, ${config.activeColor}, ${habits[index + 1]?.completed ? config.activeColor : 'rgb(229 231 235)'})`
                          : "rgb(229 231 235)",
                      }}
                      transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                      className="w-0.5 flex-1 min-h-[36px] mt-0.5"
                    />
                  )}
                </div>

                {/* Habit Card */}
                <div className="flex-1">
                  <HabitCard
                    habit={habit}
                    onToggle={onToggleHabit}
                    onEdit={onEditHabit}
                    onDelete={onDeleteHabit}
                    index={index}
                    completedCount={completedCount}
                    totalCount={totalCount}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
