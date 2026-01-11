"use client";

import { motion } from "framer-motion";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PointsCardProps {
  points: number;
  stats: {
    post: string;
    forestArea: string;
    time: string;
  };
}

export function PointsCard({ points, stats }: PointsCardProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Habity Progress",
          text: `I've earned ${points} points this week on Habity!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Points Earned */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Points Earned</h3>
          <p className="text-sm text-muted-foreground">For this week</p>
        </div>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
          className="text-4xl font-bold text-primary"
        >
          {points} <span className="text-lg font-normal text-muted-foreground">Points</span>
        </motion.span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground">Post</p>
          <p className="text-xl font-bold text-foreground">{stats.post}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground">Forest area</p>
          <p className="text-xl font-bold text-foreground">{stats.forestArea}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground">Time</p>
          <p className="text-xl font-bold text-foreground">{stats.time}</p>
        </motion.div>
      </div>

      {/* Share Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Button
          onClick={handleShare}
          className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold"
        >
          <Share2 className="mr-2 h-5 w-5" />
          Share Progress
        </Button>
      </motion.div>
    </div>
  );
}
