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
    stop,
  };
}
