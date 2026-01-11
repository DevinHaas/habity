"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
}

interface ConfettiProps {
  isActive: boolean;
  onComplete?: () => void;
}

const COLORS = ["#E86A33", "#8B9A46", "#D4A5C9", "#5D4E37", "#C17F59"];

export function Confetti({ isActive, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isActive) {
      const newPieces: ConfettiPiece[] = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.3,
        rotation: Math.random() * 360,
      }));
      setPieces(newPieces);

      const timer = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            opacity: 1,
            y: -20,
            x: `${piece.x}vw`,
            rotate: piece.rotation,
            scale: 1,
          }}
          animate={{
            opacity: 0,
            y: "100vh",
            rotate: piece.rotation + 720,
            scale: 0,
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 2,
            delay: piece.delay,
            ease: "easeOut",
          }}
          className="fixed top-0 z-[100] pointer-events-none"
          style={{
            width: "10px",
            height: "10px",
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </AnimatePresence>
  );
}
