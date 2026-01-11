"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReminderCardProps {
  onSetReminder?: () => void;
}

export function ReminderCard({ onSetReminder }: ReminderCardProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-olive-light/50 to-cream-dark p-5"
      >
        {/* Dismiss button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-3 top-3 p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex-1 space-y-2">
            <h3 className="font-bold text-lg text-foreground">Set the reminder</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Never miss your morning routine!
              <br />
              Set a reminder to stay on track
            </p>
            <Button
              onClick={onSetReminder}
              className="mt-3 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-6"
              size="sm"
            >
              Set Now
            </Button>
          </div>

          {/* Bell illustration */}
          <div className="relative">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              className="relative"
            >
              {/* Bell body */}
              <div className="w-20 h-24 relative">
                <svg viewBox="0 0 80 96" className="w-full h-full">
                  {/* Bell shape */}
                  <path
                    d="M40 8 L40 16 M20 88 L60 88 M16 72 L16 48 C16 28 26 16 40 16 C54 16 64 28 64 48 L64 72 L16 72"
                    fill="#E86A33"
                    stroke="#C45A28"
                    strokeWidth="2"
                  />
                  {/* Bell bottom curve */}
                  <ellipse cx="40" cy="72" rx="28" ry="8" fill="#E86A33" />
                  {/* Clapper */}
                  <circle cx="40" cy="84" r="6" fill="#C45A28" />
                  {/* Decorative leaf */}
                  <path
                    d="M64 32 Q72 24 80 32 Q72 40 64 32"
                    fill="#8B9A46"
                  />
                  <path
                    d="M68 40 Q74 36 80 44 Q72 48 68 40"
                    fill="#6B7A36"
                  />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
