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
    <div className="flex justify-center gap-4 py-6">
      {habits.map((habit, index) => (
        <div key={habit.name} className="flex flex-col items-center gap-3">
          {/* Progress bar container */}
          <div className="relative h-40 w-16">
            {/* Background stripes */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 64 160">
                <defs>
                  <pattern
                    id={`stripes-${index}`}
                    patternUnits="userSpaceOnUse"
                    width="8"
                    height="8"
                    patternTransform="rotate(45)"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="8"
                      stroke="#E8E0D5"
                      strokeWidth="4"
                    />
                  </pattern>
                </defs>
                <rect
                  x="0"
                  y="0"
                  width="64"
                  height="160"
                  fill={`url(#stripes-${index})`}
                  rx="32"
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
              <span className="text-white font-bold text-sm">
                {habit.progress}%
              </span>
            </motion.div>
          </div>

          {/* Label */}
          <span className="text-sm text-muted-foreground font-medium">
            {habit.name}
          </span>
        </div>
      ))}
    </div>
  );
}
