"use client";

import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { useAmbientSound } from "@/hooks";
import { cn } from "@/lib/utils";

export function AmbientSoundToggle() {
  const { isPlaying, toggleAmbient, currentSound } = useAmbientSound();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleAmbient}
      className={cn(
        "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors",
        isPlaying
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      )}
      title={isPlaying ? `Playing ${currentSound} ambient` : "Enable ambient sounds"}
    >
      {isPlaying ? (
        <Volume2 className="h-4 w-4" />
      ) : (
        <VolumeX className="h-4 w-4" />
      )}
      <span className="hidden sm:inline">
        {isPlaying ? currentSound : "Sound"}
      </span>
    </motion.button>
  );
}
