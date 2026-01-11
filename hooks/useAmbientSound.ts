"use client";

import { useAmbientSoundContext } from "@/lib/AmbientSoundProvider";

/**
 * Hook to access ambient sound context
 * @deprecated Use useAmbientSoundContext directly for better type safety
 */
export function useAmbientSound() {
  return useAmbientSoundContext();
}
