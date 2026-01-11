"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const STORAGE_KEY = "habity-ambient-enabled";
const VOLUME_KEY = "habity-ambient-volume";

export function useAmbientSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.3);
  const [currentSound, setCurrentSound] = useState<"morning" | "night">("morning");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Determine sound based on time of day
  const getSoundForTime = useCallback(() => {
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour < 18;
    return isDaytime ? "morning" : "night";
  }, []);

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEnabled = localStorage.getItem(STORAGE_KEY);
      const savedVolume = localStorage.getItem(VOLUME_KEY);
      
      if (savedEnabled === "true") {
        setIsPlaying(true);
      }
      if (savedVolume) {
        setVolumeState(parseFloat(savedVolume));
      }
    }
  }, []);

  // Update current sound based on time
  useEffect(() => {
    setCurrentSound(getSoundForTime());
    
    // Check every minute for time changes
    const interval = setInterval(() => {
      const newSound = getSoundForTime();
      if (newSound !== currentSound) {
        setCurrentSound(newSound);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [getSoundForTime, currentSound]);

  // Manage audio playback
  useEffect(() => {
    if (typeof window === "undefined") return;

    const soundFile = currentSound === "morning" ? "/sounds/morning.wav" : "/sounds/night.wav";

    if (isPlaying) {
      if (!audioRef.current) {
        audioRef.current = new Audio(soundFile);
        audioRef.current.loop = true;
        audioRef.current.volume = volume;
      } else if (audioRef.current.src !== window.location.origin + soundFile) {
        // Sound file changed (time of day changed)
        audioRef.current.pause();
        audioRef.current.src = soundFile;
        audioRef.current.load();
      }
      
      audioRef.current.volume = volume;
      audioRef.current.play().catch(() => {
        // Auto-play might be blocked, that's okay
        console.log("Ambient sound auto-play blocked. User interaction required.");
      });
    } else if (audioRef.current) {
      audioRef.current.pause();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isPlaying, currentSound, volume]);

  const toggleAmbient = useCallback(() => {
    setIsPlaying((prev) => {
      const newValue = !prev;
      localStorage.setItem(STORAGE_KEY, String(newValue));
      return newValue;
    });
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    localStorage.setItem(VOLUME_KEY, String(clampedVolume));
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, []);

  const startAmbient = useCallback(() => {
    setIsPlaying(true);
    localStorage.setItem(STORAGE_KEY, "true");
  }, []);

  const stopAmbient = useCallback(() => {
    setIsPlaying(false);
    localStorage.setItem(STORAGE_KEY, "false");
  }, []);

  return {
    isPlaying,
    volume,
    currentSound,
    toggleAmbient,
    setVolume,
    startAmbient,
    stopAmbient,
  };
}
