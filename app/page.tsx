"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarStrip } from "@/components/home/CalendarStrip";
import { ReminderCard } from "@/components/home/ReminderCard";
import { HabitList } from "@/components/home/HabitList";
import { BottomNav, FloatingAddButton } from "@/components/layout/BottomNav";
import { Avatar } from "@/components/shared/Avatar";
import { AmbientSoundToggle } from "@/components/shared/AmbientSoundToggle";
import { useHabits } from "@/hooks";

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { habits, toggleHabit } = useHabits();

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    return "Evening";
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg safe-area-top"
      >
        <div className="mx-auto max-w-lg px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {getGreeting()}, Budi
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <AmbientSoundToggle />
              <Avatar />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="mx-auto max-w-lg px-6 space-y-6">
        {/* Calendar Strip */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CalendarStrip
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </motion.section>

        {/* Reminder Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ReminderCard />
        </motion.section>

        {/* Habit List */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <HabitList habits={habits} onToggleHabit={toggleHabit} />
        </motion.section>
      </main>

      {/* Floating Add Button */}
      <FloatingAddButton />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
