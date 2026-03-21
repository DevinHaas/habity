"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Trophy, ChevronRight, Plus } from "lucide-react";
import { GoalCard } from "@/components/goals/GoalCard";
import { BottomNav, FloatingAddButton } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";
import { useGoals, type GoalWithProgress } from "@/hooks/useGoals";
import { useStatsData, useTimeOfDay } from "@/hooks";
import { Button } from "@/components/ui/button";

export default function GoalsPage() {
  const { goals, totalCoins, removeGoal } = useGoals();
  const { stats } = useStatsData();
  const { isDay } = useTimeOfDay();

  const completedGoals = goals.filter((g: GoalWithProgress) => g.isCompleted);
  const activeGoals = goals.filter((g: GoalWithProgress) => !g.isCompleted);

  // Background image changes based on time of day
  const backgroundImage = isDay ? "/archer_target.jpeg" : "/archer_target_night.jpeg";

  return (
    <ProGate>
      <GoalsContent />
    </ProGate>
  );
}
