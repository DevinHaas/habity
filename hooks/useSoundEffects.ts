"use client";

import useSound from "use-sound";

export function useSoundEffects() {
  const [playComplete] = useSound("/sounds/finish.wav", { volume: 0.5 });
  const [playLevelUp] = useSound("/sounds/level_up.wav", { volume: 0.6 });
  
  // These will need sound files to be added
  const [playStreak] = useSound("/sounds/finish.wav", { volume: 0.4 }); // Using finish as fallback
  const [playSuccess] = useSound("/sounds/finish.wav", { volume: 0.5 }); // Using finish as fallback
  const [playTap] = useSound("/sounds/finish.wav", { volume: 0.1 }); // Using finish as fallback

  return {
    playComplete,
    playLevelUp,
    playStreak,
    playSuccess,
    playTap,
  };
}
