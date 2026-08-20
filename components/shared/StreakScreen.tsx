"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useHaptics } from "@/hooks";

interface StreakScreenProps {
  isVisible: boolean;
  onClose: () => void;
  streak: number;
}

export function StreakScreen({ isVisible, onClose, streak }: StreakScreenProps) {
  const { duolingoSuccess } = useHaptics();
  const startValue = Math.max(0, streak - 1);
  const [displayedStreak, setDisplayedStreak] = useState(startValue);

  useEffect(() => {
    if (!isVisible) return;

    setDisplayedStreak(startValue);
    duolingoSuccess();

    if (streak <= startValue) return;

    const duration = 800;
    const steps = streak - startValue;
    const stepDuration = duration / steps;
    let current = startValue;

    const interval = setInterval(() => {
      current += 1;
      setDisplayedStreak(current);
      if (current >= streak) {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, streak]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-50 overflow-hidden bg-gradient-to-b from-orange-500 via-orange-600 to-red-700"
          onClick={onClose}
        >
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
            <div className="relative w-56 h-56 md:w-72 md:h-72">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="w-full h-full"
              >
                <DotLottieReact
                  src="/animations/Fire%20Streak%20Orange.lottie"
                  loop
                  autoplay
                  renderConfig={{ devicePixelRatio: 2 }}
                  className="w-full h-full"
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-center"
            >
              <span className="text-6xl md:text-7xl font-extrabold text-white drop-shadow-lg tabular-nums">
                {displayedStreak}
              </span>
              <h1 className="mt-2 text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                day streak!
              </h1>
              <p className="mt-2 text-lg text-white/90 drop-shadow-md">
                Keep it going, you&apos;re on fire.
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-12 text-sm text-white/70"
            >
              Tap anywhere to close
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
