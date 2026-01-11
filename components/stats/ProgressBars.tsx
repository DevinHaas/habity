"use client";

import { motion } from "framer-motion";

interface HabitProgress {
  name: string;
  progress: number;
  color: string;
}

interface ProgressBarsProps {
  habits: HabitProgress[];
}

export function ProgressBars({ habits }: ProgressBarsProps) {
  return (
    <div className="rounded-2xl bg-card border border-border p-4 shadow-sm h-full flex items-end justify-center gap-3 min-h-[300px]">
      {habits.map((habit, index) => (
        <div key={habit.name} className="flex flex-col items-center gap-2 h-full justify-end">
          {/* Progress bar container */}
          <div className="relative w-12 flex-1 min-h-[200px]">
            {/* Background stripes */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 48 200" preserveAspectRatio="none">
                <defs>
                  <pattern
                    id={`stripes-${index}`}
                    patternUnits="userSpaceOnUse"
                    width="6"
                    height="6"
                    patternTransform="rotate(45)"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="6"
                      stroke="#E8E0D5"
                      strokeWidth="3"
                    />
                  </pattern>
                </defs>
                <rect
                  x="0"
                  y="0"
                  width="48"
                  height="200"
                  fill={`url(#stripes-${index})`}
                  rx="24"
                />
              </svg>
            </div>

            {/* Progress fill */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${habit.progress}%` }}
              transition={{
                duration: 1,
                delay: index * 0.2,
                ease: "easeOut",
              }}
              className="absolute bottom-0 left-0 right-0 rounded-full flex items-center justify-center"
              style={{ backgroundColor: habit.color }}
            >
              <span className="text-white font-bold text-[10px]">
                {habit.progress}%
              </span>
            </motion.div>
          </div>

          {/* Label */}
          <span className="text-xs text-muted-foreground font-medium">
            {habit.name}
          </span>
        </div>
      ))}
    </div>
  );
}
