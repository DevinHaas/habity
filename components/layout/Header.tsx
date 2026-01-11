"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  coins: number;
  streak: number;
  variant?: "default" | "transparent";
  className?: string;
}

export function Header({ coins, streak, variant = "default", className }: HeaderProps) {
  const isTransparent = variant === "transparent";
  
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "sticky top-0 z-50 safe-area-top",
        isTransparent
          ? "bg-transparent"
          : "bg-background/80 backdrop-blur-lg border-b border-border/50",
        className
      )}
    >
      <div className="mx-auto max-w-lg px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Coins */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full",
              isTransparent
                ? "backdrop-blur-md bg-white/20"
                : "bg-amber-50 dark:bg-amber-950/30"
            )}
          >
            <Image
              src="/coin.png"
              alt="Coins"
              width={20}
              height={20}
              className="object-contain"
            />
            <span
              className={cn(
                "text-sm font-semibold tabular-nums",
                isTransparent
                  ? "text-white drop-shadow-sm"
                  : "text-amber-700 dark:text-amber-400"
              )}
            >
              {coins.toLocaleString()}
            </span>
          </motion.div>

          {/* Streak */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full",
              isTransparent
                ? "backdrop-blur-md bg-white/20"
                : "bg-orange-50 dark:bg-orange-950/30"
            )}
          >
            <Flame
              className={cn(
                "h-5 w-5",
                isTransparent
                  ? "text-orange-300"
                  : "text-orange-500"
              )}
            />
            <span
              className={cn(
                "text-sm font-semibold tabular-nums",
                isTransparent
                  ? "text-white drop-shadow-sm"
                  : "text-orange-600 dark:text-orange-400"
              )}
            >
              {streak} day{streak !== 1 ? "s" : ""}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
