"use client";

import { useState, useCallback } from "react";

export interface Habit {
  id: string;
  name: string;
  icon: string;
  streak: number;
  duration: string;
  completed: boolean;
  color: string;
  repeatDays: number[]; // 0 = Monday, 6 = Sunday
}

export interface UserStats {
  level: number;
  points: number;
  totalPoints: number;
  currentBadge: number;
  habits: { name: string; progress: number; color: string }[];
}

// Mock data
const INITIAL_HABITS: Habit[] = [
  {
    id: "1",
    name: "Drink a glass of water",
    icon: "💧",
    streak: 3,
    duration: "5 min",
    completed: true,
    color: "#5D4E37",
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
  },
  {
    id: "2",
    name: "Meditate to relax",
    icon: "🧘",
    streak: 6,
    duration: "15 min",
    completed: true,
    color: "#C17F59",
    repeatDays: [0, 1, 2, 3, 4, 5, 6],
  },
  {
    id: "3",
    name: "Stretch for 10 minutes",
    icon: "🤸",
    streak: 5,
    duration: "10 min",
    completed: false,
    color: "#D4A5C9",
    repeatDays: [0, 1, 2, 3, 4],
  },
  {
    id: "4",
    name: "Go for a short walk",
    icon: "🚶",
    streak: 3,
    duration: "20 min",
    completed: false,
    color: "#8B9A46",
    repeatDays: [0, 2, 4, 6],
  },
];

const INITIAL_STATS: UserStats = {
  level: 12,
  points: 842,
  totalPoints: 1200,
  currentBadge: 2,
  habits: [
    { name: "Walking", progress: 48, color: "#5D4E37" },
    { name: "Running", progress: 33, color: "#8B9A46" },
    { name: "Meditation", progress: 27, color: "#C17F59" },
    { name: "Drink", progress: 40, color: "#D4A5C9" },
  ],
};

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);

  const toggleHabit = useCallback((id: string) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              completed: !habit.completed,
              streak: !habit.completed ? habit.streak + 1 : habit.streak - 1,
            }
          : habit
      )
    );
    
    // Update points when completing a habit
    setStats((prev) => ({
      ...prev,
      points: prev.points + 10,
    }));
  }, []);

  const addHabit = useCallback((habit: Omit<Habit, "id" | "streak" | "completed">) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      streak: 0,
      completed: false,
    };
    setHabits((prev) => [...prev, newHabit]);
  }, []);

  const removeHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
  }, []);

  const getHabitsForDay = useCallback(
    (dayOfWeek: number) => {
      return habits.filter((habit) => habit.repeatDays.includes(dayOfWeek));
    },
    [habits]
  );

  const getTodayHabits = useCallback(() => {
    const today = new Date().getDay();
    // Convert Sunday (0) to 6, and shift other days back by 1 to make Monday = 0
    const adjustedDay = today === 0 ? 6 : today - 1;
    return getHabitsForDay(adjustedDay);
  }, [getHabitsForDay]);

  const getCompletedCount = useCallback(() => {
    return habits.filter((h) => h.completed).length;
  }, [habits]);

  const getTotalCount = useCallback(() => {
    return habits.length;
  }, [habits]);

  return {
    habits,
    stats,
    toggleHabit,
    addHabit,
    removeHabit,
    getHabitsForDay,
    getTodayHabits,
    getCompletedCount,
    getTotalCount,
  };
}
