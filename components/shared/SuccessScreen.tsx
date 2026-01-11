"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Lottie from "lottie-react";
import useSound from "use-sound";
import { useTimeOfDay, useHaptics } from "@/hooks";
import CelebrateAnimation from "@/public/success/Celebrate.json";

interface SuccessScreenProps {
  isVisible: boolean;
  onClose: () => void;
}

export function SuccessScreen({ isVisible, onClose }: SuccessScreenProps) {
  const { isDay } = useTimeOfDay();
  const { duolingoSuccess } = useHaptics();
  
  // Fanfare sound effect
  const [playFanfare] = useSound("/sounds/fanfare.wav", { volume: 0.7 });

  const backgroundImage = isDay
    ? "/hero_background.jpeg"
    : "/hero_background_night.jpeg";

  // Play sound and haptics when screen appears
  useEffect(() => {
    if (isVisible) {
      // Play fanfare sound
      playFanfare();
      
      // Trigger Duolingo-style haptic feedback
      duolingoSuccess();
    }
  }, [isVisible, playFanfare, duolingoSuccess]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-50 overflow-hidden"
          onClick={onClose}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={backgroundImage}
              alt="Success Background"
              fill
              className="object-cover"
              priority
            />
            {/* Dark overlay for better contrast */}
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Celebrate Lottie - Full screen background effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ width: "100vw", height: "100vh", minHeight: "100vh" }}
          >
            <Lottie
              animationData={CelebrateAnimation}
              loop={true}
              style={{ 
                width: "100vw", 
                height: "100vh", 
                minHeight: "100vh",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
              }}
              rendererSettings={{
                preserveAspectRatio: "xMidYMid slice"
              }}
            />
          </div>

          {/* Main Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
            {/* Trophy and Trumpets Container */}
            <div 
              className="relative flex items-center justify-center"
              style={{ perspective: 1000 }}
            >
              {/* Left Trumpet - slides in from RIGHT, rotates to point at trophy */}
              <motion.div
                initial={{ x: 100, opacity: 0, rotate: 0 }}
                animate={{ x: 0, opacity: 1, rotate: -30 }}
                transition={{ delay: 0.3, type: "spring", damping: 18, stiffness: 120 }}
                className="absolute -left-32 translate-y-1/4 md:-left-20"
              >
                <Image
                  src="/success/trumpets.png"
                  alt="Trumpet"
                  width={260}
                  height={260}
                  className="w-40 h-40 md:w-64 md:h-64 object-contain drop-shadow-lg"
                />
              </motion.div>

              {/* Trophy Image - Center with 3D rotation */}
              <motion.div
                initial={{ scale: 0, opacity: 0, rotateY: -180 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ 
                  delay: 0.2, 
                  type: "spring", 
                  damping: 12,
                  rotateY: { duration: 0.8, ease: "easeOut" }
                }}
                className="relative z-10"
                style={{ transformStyle: "preserve-3d" }}
              >
                <Image
                  src="/success/trophy.png"
                  alt="Trophy"
                  width={256}
                  height={256}
                  className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl"
                />
              </motion.div>

              {/* Right Trumpet - slides in from LEFT, rotates to point at trophy */}
              <motion.div
                initial={{ x: -200, opacity: 0, rotate: 30 }}
                animate={{ x: 0, opacity: 1, rotate: 30 }}
                transition={{ delay: 0.3, type: "spring", damping: 18, stiffness: 120 }}
                className="absolute -right-32 translate-y-1/4 md:-right-20"
              >
                <Image
                  src="/success/trumpets_left.png"
                  alt="Trumpet"
                  width={160}
                  height={160}
                  className="w-40 h-40 md:w-64 md:h-64 object-contain drop-shadow-lg"
                />
              </motion.div>
            </div>

            {/* Success Message */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                All Done!
              </h1>
              <p className="mt-2 text-lg text-white/90 drop-shadow-md">
                You&apos;ve completed all your habits today!
              </p>
            </motion.div>

            {/* Tap to close hint */}
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
