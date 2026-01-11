"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { HabitForm } from "@/components/habits/HabitForm";
import type { HabitFormValues } from "@/lib/validations/habit";

export default function AddHabitPage() {
  const router = useRouter();

  const handleSubmit = (values: HabitFormValues) => {
    // In a real app, this would save to a database
    console.log("New habit:", values);
    router.push("/");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg safe-area-top"
      >
        <div className="mx-auto max-w-lg px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">New habit</h1>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleCancel}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors"
            >
              <X className="h-6 w-6 text-muted-foreground" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Form */}
      <main className="mx-auto max-w-lg px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <HabitForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </motion.div>
      </main>
    </div>
  );
}
