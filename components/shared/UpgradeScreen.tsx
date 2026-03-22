"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTimeOfDay } from "@/hooks/useTimeOfDay";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface UpgradeScreenProps {
  onDismiss: () => void;
}

export function UpgradeScreen({ onDismiss }: UpgradeScreenProps) {
  const { isDay } = useTimeOfDay();
  const [showContinue, setShowContinue] = useState(false);
  const { playUpgrade, playCoin } = useSoundEffects();
  const playUpgradeRef = useRef(playUpgrade);
  useLayoutEffect(() => {
    playUpgradeRef.current = playUpgrade;
  });

  // Show continue button at 5s
  useEffect(() => {
    const timer = setTimeout(() => setShowContinue(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Play upgrade sound after delay matching framer-motion card animation delay
  useEffect(() => {
    const timer = setTimeout(() => playUpgradeRef.current(), 600);
    return () => clearTimeout(timer);
  }, []);

  const bgSrc = isDay ? "/hero_background.jpeg" : "/hero_background_night.jpeg";

  return (
    <div className="fixed inset-0 z-200 overflow-hidden">
      <Image src={bgSrc} alt="" fill className="object-cover" priority />
      {/* Card stage */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative" style={{ width: 280, height: 380 }}>
          {/* Free card — slides up and out over 2s */}
          <motion.div
            className="absolute inset-0"
            initial={{ y: 0, scale: 1 }}
            animate={{ y: "-110vh", scale: 0.6 }}
            transition={{ duration: 2.0, ease: "easeIn", delay: 0.6 }}
          >
            <Image
              src="/tiers/free.png"
              alt="Free tier"
              width={280}
              height={380}
              className="rounded-2xl "
            />
          </motion.div>

          {/* Pro card — drops in starting at 1.8s, slow spring settles ~5-6s */}
          <motion.div
            className="absolute inset-0"
            initial={{ y: "-110vh", scale: 0.2 }}
            animate={{ y: 0, scale: 1.5 }}
            transition={{
              duration: 3.0,
              delay: 1.8,
              type: "tween",
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Image
              src="/tiers/pro.png"
              alt="Pro tier"
              width={280}
              height={380}
              className="rounded-2xl "
            />
          </motion.div>
        </div>
      </div>

      {/* Pro tier text */}
      <motion.div
        className="absolute top-24 left-0 right-0 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 3.5, ease: "easeOut" }}
      >
        <p className="text-white/70 text-sm font-medium uppercase tracking-widest">
          Welcome to
        </p>
        <h1 className="text-white text-4xl font-bold tracking-tight drop-shadow-lg">
          Habity Pro
        </h1>
      </motion.div>

      {/* Continue button */}
      <motion.div
        className="absolute bottom-16 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContinue ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <Button
          onClick={onDismiss}
          size="lg"
          className="rounded-2xl bg-white text-black hover:bg-white/90 font-semibold px-8"
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
}
