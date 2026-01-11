"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, Trash2, Edit2, Trophy } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getCriteriaUnit } from "@/lib/validations/goal";
import type { GoalWithProgress } from "@/hooks/useGoals";

interface GoalCardProps {
  goal: GoalWithProgress;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  index?: number;
}

export function GoalCard({ goal, onDelete, onEdit, index = 0 }: GoalCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const formatValue = (value: number, type: string) => {
    if (type === "coins") {
      return value.toLocaleString();
    }
    return value.toString();
  };

  const unit = getCriteriaUnit(goal.criteriaType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "relative flex items-center gap-4 rounded-2xl bg-card p-4 shadow-sm border border-border",
        goal.isCompleted && "ring-2 ring-success"
      )}
    >
      {/* Image / Emoji Container */}
      <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-muted overflow-hidden">
        {goal.imageUrl ? (
          <Image
            src={goal.imageUrl}
            alt={goal.name}
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-4xl">{goal.emoji}</span>
        )}
        {goal.isCompleted && (
          <div className="absolute inset-0 bg-success/20 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-success" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Category */}
        {goal.category && (
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {goal.category}
          </p>
        )}

        {/* Name */}
        <h3 className="font-semibold text-foreground truncate text-lg">
          {goal.name}
        </h3>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(goal.progress)}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${goal.progress}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 + 0.2, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                goal.isCompleted ? "bg-success" : "bg-olive"
              )}
            />
          </div>
        </div>

        {/* Values */}
        <p className="text-sm">
          <span className="font-bold text-foreground">
            {formatValue(goal.currentValue, goal.criteriaType)}
          </span>
          <span className="text-muted-foreground">
            {" "}/ {formatValue(goal.targetValue, goal.criteriaType)} {unit}
          </span>
        </p>
      </div>

      {/* Menu Button */}
      <div className="relative">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowMenu(!showMenu)}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted transition-colors"
        >
          <MoreVertical className="h-5 w-5 text-muted-foreground" />
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {showMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-10 z-50 w-36 rounded-xl bg-card border border-border shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => {
                    onEdit?.(goal.id);
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <Edit2 className="h-4 w-4" style={{ color: 'var(--edit-action)' }} />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete?.(goal.id);
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-muted transition-colors"
                  style={{ color: 'var(--delete-action)' }}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
