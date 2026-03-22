"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX, LogOut } from "lucide-react";
import { useAmbientSound } from "@/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { isPlaying, toggleAmbient, volume, setVolume } = useAmbientSound();
  const [localVolume, setLocalVolume] = useState(volume);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Sync local volume with hook volume
  useEffect(() => {
    setLocalVolume(volume);
  }, [volume]);

  const handleLogout = async () => {
    queryClient.clear();
    await signOut();
    onClose();
    router.push("/login");
  };

  const handleVolumeChange = (newVolume: number) => {
    setLocalVolume(newVolume);
    setVolume(newVolume);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <Card
              className="w-full max-w-md pointer-events-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                <CardTitle className="text-xl font-semibold">Settings</CardTitle>
                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 hover:bg-muted transition-colors"
                  aria-label="Close settings"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </CardHeader>

              <CardContent className="pt-6 space-y-6">
                {/* Ambient Sound Toggle */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex-1">
                    <Label htmlFor="ambient-sound" className="text-base font-medium">
                      Ambient Sound
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Play background music based on time of day
                    </p>
                  </div>
                  <Switch
                    id="ambient-sound"
                    checked={isPlaying}
                    onCheckedChange={toggleAmbient}
                  />
                </div>

                {/* Volume Control */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="volume" className="text-base font-medium">
                      Volume
                    </Label>
                    <div className="flex items-center gap-2">
                      {localVolume === 0 ? (
                        <VolumeX className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Volume2 className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-sm text-muted-foreground w-10 text-right tabular-nums">
                        {Math.round(localVolume * 100)}%
                      </span>
                    </div>
                  </div>
                  <input
                    id="volume"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={localVolume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    disabled={!isPlaying}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${localVolume * 100}%, var(--muted) ${localVolume * 100}%, var(--muted) 100%)`,
                    }}
                  />
                </div>
                {/* Logout */}
                <div className="pt-2 border-t">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 rounded-md border border-red-500 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}