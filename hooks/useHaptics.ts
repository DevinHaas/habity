"use client";

import { useCallback } from "react";

export function useHaptics() {
  const canVibrate = typeof navigator !== "undefined" && "vibrate" in navigator;

  const vibrate = useCallback(
    (pattern: number | number[]) => {
      if (canVibrate) {
        navigator.vibrate(pattern);
      }
    },
    [canVibrate]
  );

  const tapLight = useCallback(() => {
    vibrate(10);
  }, [vibrate]);

  const tapMedium = useCallback(() => {
    vibrate(50);
  }, [vibrate]);

  const success = useCallback(() => {
    vibrate([50, 30, 50, 30, 100]);
  }, [vibrate]);

  const celebrate = useCallback(() => {
    vibrate([100, 50, 100, 50, 200]);
  }, [vibrate]);

  // Duolingo-inspired addictive celebration pattern
  // Build-up → Peak → Sparkle fade-out
  const duolingoSuccess = useCallback(() => {
    vibrate([
      // Build-up phase - quick escalating bursts
      15, 30,   // tiny tap
      20, 25,   // small tap
      30, 20,   // growing
      40, 20,   // stronger
      50, 15,   // building
      60, 15,   // almost there
      // Peak celebration - strong sustained hits
      80, 40,   // big hit
      100, 30,  // bigger
      120, 25,  // PEAK
      150, 50,  // MAJOR PEAK
      120, 30,  // sustain
      // Trailing sparkles - satisfying fade out
      80, 40,   // coming down
      60, 50,   // softer
      40, 60,   // gentle
      25, 70,   // fading
      15, 80,   // whisper
      10,       // final tiny tap
    ]);
  }, [vibrate]);

  const stop = useCallback(() => {
    if (canVibrate) {
      navigator.vibrate(0);
    }
  }, [canVibrate]);

  return {
    canVibrate,
    tapLight,
    tapMedium,
    success,
    celebrate,
    duolingoSuccess,
    stop,
  };
}
