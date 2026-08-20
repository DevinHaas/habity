"use client";

import { useCallback } from "react";
import { useSoundEffects } from "./useSoundEffects";
import { useHaptics } from "./useHaptics";
import { useCompletionSound } from "./useCompletionSound";

export function useFeedback() {
  const sounds = useSoundEffects();
  const haptics = useHaptics();
  const { playCompletionSound } = useCompletionSound();

  const onHabitComplete = useCallback(() => {
    playCompletionSound();
    haptics.tapMedium();
  }, [playCompletionSound, haptics]);

  const onHabitAdded = useCallback(() => {
    sounds.playSuccess();
    haptics.success();
  }, [sounds, haptics]);

  const onStreak = useCallback(() => {
    sounds.playStreak();
    haptics.success();
  }, [sounds, haptics]);

  const onLevelUp = useCallback(() => {
    sounds.playLevelUp();
    haptics.celebrate();
  }, [sounds, haptics]);

  const onTap = useCallback(() => {
    sounds.playTap();
    haptics.tapLight();
  }, [sounds, haptics]);

  return {
    onHabitComplete,
    onHabitAdded,
    onStreak,
    onLevelUp,
    onTap,
  };
}
