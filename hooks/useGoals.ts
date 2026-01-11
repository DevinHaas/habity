"use client";

import { useCallback, useMemo } from "react";
import { useGoalsQuery } from "./queries/useGoalsQuery";
import { useAddGoal, useUpdateGoal, useDeleteGoal } from "./mutations/useGoalMutations";
import { useHabits } from "./useHabits";
import type { goals as goalsTable } from "@/db/schema";

export type CriteriaType = "coins" | "streak" | "completions" | "level";

type DbGoal = typeof goalsTable.$inferSelect;

export interface Goal {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
  emoji: string;
  criteriaType: CriteriaType;
  targetValue: number;
  habitId?: string;
  createdAt: Date;
}

export interface GoalWithProgress extends Goal {
  currentValue: number;
  progress: number;
  isCompleted: boolean;
}

// Emoji mapping based on common reward keywords
const EMOJI_MAP: Record<string, string> = {
  // Tech
  airpods: "🎧",
  headphones: "🎧",
  phone: "📱",
  iphone: "📱",
  laptop: "💻",
  computer: "💻",
  macbook: "💻",
  ipad: "📱",
  tablet: "📱",
  watch: "⌚",
  camera: "📷",
  tv: "📺",
  gaming: "🎮",
  playstation: "🎮",
  xbox: "🎮",
  nintendo: "🎮",

  // Fashion
  shoes: "👟",
  sneakers: "👟",
  boots: "👢",
  bag: "👜",
  purse: "👜",
  wallet: "👛",
  clothes: "👕",
  shirt: "👕",
  dress: "👗",
  jacket: "🧥",
  hat: "🧢",
  sunglasses: "🕶️",
  jewelry: "💍",

  // Food & Drink
  coffee: "☕",
  restaurant: "🍽️",
  dinner: "🍽️",
  lunch: "🍱",
  pizza: "🍕",
  sushi: "🍣",
  cake: "🎂",
  ice: "🍦",
  chocolate: "🍫",

  // Activities
  travel: "✈️",
  vacation: "🏖️",
  trip: "✈️",
  concert: "🎵",
  movie: "🎬",
  spa: "💆",
  massage: "💆",
  gym: "🏋️",
  fitness: "🏋️",
  yoga: "🧘",

  // Home
  furniture: "🛋️",
  plant: "🪴",
  candle: "🕯️",
  book: "📚",
  books: "📚",
  art: "🎨",

  // Toys & Collectibles
  toy: "🧸",
  figure: "🎭",
  plush: "🧸",
  lego: "🧱",

  // General
  gift: "🎁",
  present: "🎁",
  reward: "🏆",
  treat: "🍬",
  money: "💰",
  savings: "💰",
};

const DEFAULT_EMOJI = "🎯";

// Generate emoji based on goal name
export function generateEmojiFromName(name: string): string {
  const lowerName = name.toLowerCase();

  for (const [keyword, emoji] of Object.entries(EMOJI_MAP)) {
    if (lowerName.includes(keyword)) {
      return emoji;
    }
  }

  return DEFAULT_EMOJI;
}

export function useGoals() {
  const { habits, stats } = useHabits();

  // Queries
  const { data: dbGoals = [], isPending } = useGoalsQuery();

  // Mutations
  const addMutation = useAddGoal();
  const updateMutation = useUpdateGoal();
  const deleteMutation = useDeleteGoal();

  // Transform DB goals to frontend goals
  const goals = useMemo((): Goal[] => {
    return dbGoals.map((dbGoal) => ({
      id: dbGoal.id,
      name: dbGoal.name,
      category: dbGoal.category || "",
      imageUrl: dbGoal.imageUrl || undefined,
      emoji: dbGoal.emoji,
      criteriaType: dbGoal.criteriaType as CriteriaType,
      targetValue: dbGoal.targetValue,
      habitId: dbGoal.habitId || undefined,
      createdAt: new Date(dbGoal.createdAt),
    }));
  }, [dbGoals]);

  // Calculate current value based on criteria type
  const getCurrentValue = useCallback(
    (goal: Goal): number => {
      switch (goal.criteriaType) {
        case "coins":
          return stats.coins;
        case "streak":
          if (goal.habitId) {
            const habit = habits.find((h) => h.id === goal.habitId);
            return habit?.streak ?? 0;
          }
          // Return best streak across all habits
          return Math.max(...habits.map((h) => h.streak), 0);
        case "completions":
          if (goal.habitId) {
            const habit = habits.find((h) => h.id === goal.habitId);
            return habit ? habit.streak * 7 : 0;
          }
          return stats.totalHabitsCompleted;
        case "level":
          return stats.level;
        default:
          return 0;
      }
    },
    [habits, stats]
  );

  // Calculate goals with progress
  const goalsWithProgress = useMemo((): GoalWithProgress[] => {
    return goals.map((goal) => {
      const currentValue = getCurrentValue(goal);
      const progress = Math.min((currentValue / goal.targetValue) * 100, 100);
      const isCompleted = currentValue >= goal.targetValue;

      return {
        ...goal,
        currentValue,
        progress,
        isCompleted,
      };
    });
  }, [goals, getCurrentValue]);

  const addGoal = useCallback(
    (goalData: Omit<Goal, "id" | "createdAt" | "emoji"> & { emoji?: string }) => {
      addMutation.mutate({
        name: goalData.name,
        category: goalData.category || null,
        imageUrl: goalData.imageUrl || null,
        emoji: goalData.emoji || generateEmojiFromName(goalData.name),
        criteriaType: goalData.criteriaType,
        targetValue: goalData.targetValue,
        habitId: goalData.habitId || null,
      });
    },
    [addMutation]
  );

  const removeGoal = useCallback(
    (id: string) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation]
  );

  const updateGoal = useCallback(
    (id: string, updates: Partial<Omit<Goal, "id" | "createdAt">>) => {
      const updatedData: Record<string, unknown> = {};

      if (updates.name !== undefined) updatedData.name = updates.name;
      if (updates.category !== undefined) updatedData.category = updates.category;
      if (updates.imageUrl !== undefined) updatedData.imageUrl = updates.imageUrl;
      if (updates.criteriaType !== undefined) updatedData.criteriaType = updates.criteriaType;
      if (updates.targetValue !== undefined) updatedData.targetValue = updates.targetValue;
      if (updates.habitId !== undefined) updatedData.habitId = updates.habitId;

      // Auto-generate emoji if name changed but emoji wasn't provided
      if (updates.name && !updates.emoji) {
        updatedData.emoji = generateEmojiFromName(updates.name);
      } else if (updates.emoji !== undefined) {
        updatedData.emoji = updates.emoji;
      }

      updateMutation.mutate({ id, data: updatedData });
    },
    [updateMutation]
  );

  // Get total coins (for display on goals page)
  const totalCoins = stats.coins;

  return {
    goals: goalsWithProgress,
    totalCoins,
    isPending,
    addGoal,
    removeGoal,
    updateGoal,
    generateEmojiFromName,
  };
}
