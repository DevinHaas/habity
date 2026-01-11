"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type TimePeriod = "weekly" | "monthly" | "yearly";

interface TimePeriodSelectorProps {
  selected: TimePeriod;
  onSelect: (period: TimePeriod) => void;
}

const periods: { value: TimePeriod; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export function TimePeriodSelector({
  selected,
  onSelect,
}: TimePeriodSelectorProps) {
  return (
    <div className="flex rounded-lg bg-muted p-0.5">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onSelect(period.value)}
          className={cn(
            "relative flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            selected === period.value
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {selected === period.value && (
            <motion.div
              layoutId="period-indicator"
              className="absolute inset-0 bg-card rounded-md shadow-sm"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 35,
              }}
            />
          )}
          <span className="relative z-10">{period.label}</span>
        </button>
      ))}
    </div>
  );
}
