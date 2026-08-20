"use client";

import { useState, useEffect, useCallback } from "react";
import useSound from "use-sound";

const STORAGE_KEY = "habity-completion-sound";

// Picked from research on satisfying UI micro-interaction sounds (bright
// bell/chime, ascending chord, marimba strike, soft water-drop pop).
// chime/chord/xylophone/droplet/plop/todoist: Mixkit/Pixabay, CC0/royalty-free, no attribution required.
export const COMPLETION_SOUNDS = {
  none: { label: "None", file: null },
  coin: { label: "Coin", file: "/sounds/coin.wav" },
  chime: { label: "Chime", file: "/sounds/chime.mp3" },
  chord: { label: "Chord", file: "/sounds/chord.mp3" },
  xylophone: { label: "Xylophone", file: "/sounds/xylophone.mp3" },
  droplet: { label: "Droplet", file: "/sounds/droplet.mp3" },
  plop: { label: "Water Plop", file: "/sounds/plop.mp3" },
  todoist: { label: "Bright Ding", file: "/sounds/todoist.mp3" },
} as const satisfies Record<string, { label: string; file: string | null }>;

export type CompletionSoundId = keyof typeof COMPLETION_SOUNDS;

const DEFAULT_SOUND: CompletionSoundId = "coin";

function isCompletionSoundId(value: string): value is CompletionSoundId {
  return value in COMPLETION_SOUNDS;
}

export function useCompletionSound() {
  const [soundId, setSoundIdState] = useState<CompletionSoundId>(DEFAULT_SOUND);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isCompletionSoundId(saved)) {
      setSoundIdState(saved);
    }
  }, []);

  const setSoundId = useCallback((id: CompletionSoundId) => {
    setSoundIdState(id);
    localStorage.setItem(STORAGE_KEY, id);
  }, []);

  const [playCoin] = useSound(COMPLETION_SOUNDS.coin.file, { volume: 0.5 });
  const [playChime] = useSound(COMPLETION_SOUNDS.chime.file, { volume: 0.5 });
  const [playChord] = useSound(COMPLETION_SOUNDS.chord.file, { volume: 0.5 });
  const [playXylophone] = useSound(COMPLETION_SOUNDS.xylophone.file, { volume: 0.5 });
  const [playDroplet] = useSound(COMPLETION_SOUNDS.droplet.file, { volume: 0.5 });
  const [playPlop] = useSound(COMPLETION_SOUNDS.plop.file, { volume: 0.5 });
  const [playTodoist] = useSound(COMPLETION_SOUNDS.todoist.file, { volume: 0.5 });

  const players: Record<CompletionSoundId, (() => void) | null> = {
    none: null,
    coin: playCoin,
    chime: playChime,
    chord: playChord,
    xylophone: playXylophone,
    droplet: playDroplet,
    plop: playPlop,
    todoist: playTodoist,
  };

  const deps = [
    playCoin,
    playChime,
    playChord,
    playXylophone,
    playDroplet,
    playPlop,
    playTodoist,
  ];

  const preview = useCallback(
    (id: CompletionSoundId) => players[id]?.(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps,
  );

  const playCompletionSound = useCallback(
    () => players[soundId]?.(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [soundId, ...deps],
  );

  return { soundId, setSoundId, playCompletionSound, preview };
}
