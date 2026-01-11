"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeDisplayProps {
  currentLevel: number;
  currentBadge: number;
  totalPoints: number;
  pointsToNextLevel: number;
}

// 10 badges total, each badge represents 10 levels
const BADGES = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Level ${(i + 1) * 10}`,
  image: `/badges/badge_${i + 1}.png`,
  requiredLevel: (i + 1) * 10,
}));

export function BadgeDisplay({
  currentLevel,
  currentBadge,
  totalPoints,
  pointsToNextLevel,
}: BadgeDisplayProps) {
  const progressToNextLevel = ((currentLevel % 10) / 10) * 100;

  return (
    <div className="space-y-6">
      {/* Current Badge & Level */}
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="relative h-20 w-20"
        >
          <Image
            src={`/badges/badge_${currentBadge}.png`}
            alt={`Badge ${currentBadge}`}
            fill
            className="object-contain"
          />
        </motion.div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground">Level {currentLevel}</h3>
          <p className="text-sm text-muted-foreground">
            {pointsToNextLevel} points to next level
          </p>
          {/* Progress bar */}
          <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressToNextLevel}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Badge Collection */}
      <div>
        <h4 className="text-sm font-semibold text-muted-foreground mb-3">
          Badge Collection
        </h4>
        <div className="grid grid-cols-5 gap-3">
          {BADGES.map((badge, index) => {
            const isUnlocked = currentLevel >= badge.requiredLevel;
            const isCurrent = currentBadge === badge.id;

            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative aspect-square rounded-xl p-2 transition-all",
                  isUnlocked
                    ? isCurrent
                      ? "bg-primary/20 ring-2 ring-primary"
                      : "bg-muted"
                    : "bg-muted/50"
                )}
              >
                {isUnlocked ? (
                  <Image
                    src={badge.image}
                    alt={badge.name}
                    fill
                    className="object-contain p-1"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Lock className="h-5 w-5 text-muted-foreground/50" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
