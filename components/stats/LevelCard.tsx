"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { getLevelProgress } from "@/hooks/useHabits";

interface LevelCardProps {
  level: number;
  levelName: string;
  currentBadge: number;
  points: number;
  totalPoints: number;
}

export function LevelCard({
  level,
  levelName,
  currentBadge,
  points,
  totalPoints,
}: LevelCardProps) {
  const progress = getLevelProgress(points, totalPoints);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1625] via-[#2d2640] to-[#1a1625] p-4 shadow-xl"
    >
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Badge Image */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="relative w-16 h-16 mb-2"
        >
          <Image
            src={`/badges/badge_${currentBadge}.png`}
            alt={`Level ${level} Badge`}
            fill
            className="object-contain drop-shadow-[0_0_20px_rgba(232,106,51,0.4)]"
          />
        </motion.div>

        {/* Level Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg font-bold text-white mb-0.5"
        >
          {levelName}
        </motion.h2>

        {/* Level Number */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-400 mb-3"
        >
          Level <span className="text-white font-semibold">{level}</span>
        </motion.p>

        {/* XP Progress Section */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400 font-medium">XP</span>
            <span className="text-xs text-gray-400">
              <span className="text-white font-semibold">{points}</span>
              <span className="text-gray-500">/{totalPoints}</span>
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full rounded-full bg-gray-700/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
