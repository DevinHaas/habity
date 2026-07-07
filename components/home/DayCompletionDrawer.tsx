"use client";

import { motion } from "framer-motion";
import { X, Sun, SunDim, Moon, Check, XIcon } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useCompletionsQuery } from "@/hooks/queries/useHabitsQuery";
import { useToggleHabit } from "@/hooks/mutations/useHabitMutations";
import { isHabitActiveOnDate, type Habit, type TimeOfDay, type HabitStatus } from "@/lib/habits-utils";

interface DayCompletionDrawerProps {
  isOpen: boolean;
  date: Date | null;
  onClose: () => void;
  habits: Habit[];
}

const TIME_CONFIG: Record<TimeOfDay, { label: string; icon: typeof Sun; color: string }> = {
  morning: { label: "Morning", icon: Sun, color: "#F59E0B" },
  day: { label: "Day", icon: SunDim, color: "#10B981" },
  evening: { label: "Evening", icon: Moon, color: "#8B5CF6" },
};

const TIME_ORDER: TimeOfDay[] = ["morning", "day", "evening"];

function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isFuture(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d > today;
}

export function DayCompletionDrawer({ isOpen, date, onClose, habits }: DayCompletionDrawerProps) {
  const dateString = date ? toDateString(date) : "";
  const { data: completions = [] } = useCompletionsQuery(dateString);
  const toggleMutation = useToggleHabit();

  const future = date ? isFuture(date) : false;

  const activeHabits = date ? habits.filter((h) => isHabitActiveOnDate(h, date)) : habits;

  const formattedDate = date
    ? date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    : "";

  const grouped = activeHabits.reduce(
    (acc, h) => {
      const t = h.timeOfDay || "morning";
      if (!acc[t]) acc[t] = [];
      acc[t].push(h);
      return acc;
    },
    {} as Record<TimeOfDay, Habit[]>,
  );

  // Cycle: nothing → done → failed → nothing
  function nextStatus(current: HabitStatus): HabitStatus {
    if (current === "nothing") return "done";
    if (current === "done") return "failed";
    return "nothing";
  }

  function toggle(habitId: string) {
    if (future || !dateString) return;
    const log = completions.find((c) => c.habitId === habitId);
    const current: HabitStatus = (log?.status as HabitStatus) ?? "nothing";
    toggleMutation.mutate({ habitId, date: dateString, status: nextStatus(current) });
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="!max-h-[90vh]">
        <DrawerHeader className="text-left border-b border-border px-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-xl font-bold">{formattedDate}</DrawerTitle>
              <DrawerDescription className="mt-1">
                {completions.length} of {activeHabits.length} completed
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors"
              >
                <X className="h-6 w-6 text-muted-foreground" />
              </motion.button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="overflow-y-auto flex-1 px-6 py-4">
          {activeHabits.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No habits yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {TIME_ORDER.map((timeOfDay) => {
                const group = grouped[timeOfDay];
                if (!group?.length) return null;
                const config = TIME_CONFIG[timeOfDay];
                const Icon = config.icon;

                return (
                  <div key={timeOfDay}>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="h-4 w-4" style={{ color: config.color }} />
                      <span className="text-sm font-medium text-foreground">{config.label}</span>
                      <span className="text-xs text-muted-foreground">({group.length})</span>
                    </div>

                    <div className="space-y-2">
                      {group.map((habit) => {
                        const log = completions.find((c) => c.habitId === habit.id);
                        const status: HabitStatus = (log?.status as HabitStatus) ?? "nothing";
                        return (
                          <motion.div
                            key={habit.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 p-3 rounded-xl bg-background"
                          >
                            <div
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl"
                              style={{ backgroundColor: `${habit.color}20` }}
                            >
                              {habit.icon}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm text-foreground truncate">
                                {habit.name}
                              </h3>
                              <p className="text-xs text-muted-foreground">{habit.duration}</p>
                            </div>

                            <motion.button
                              whileTap={future ? undefined : { scale: 0.85 }}
                              onClick={() => toggle(habit.id)}
                              disabled={future}
                              className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors shrink-0",
                                future && "opacity-30 cursor-not-allowed border-muted",
                                !future && status === "nothing" && "border-muted hover:border-foreground/40",
                                !future && status === "done" && "border-transparent",
                                !future && status === "failed" && "border-transparent bg-red-500",
                              )}
                              style={!future && status === "done" ? { backgroundColor: habit.color } : undefined}
                            >
                              {status === "done" && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
                              {status === "failed" && <XIcon className="h-4 w-4 text-white" strokeWidth={3} />}
                            </motion.button>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="h-8 bg-card shrink-0" />
      </DrawerContent>
    </Drawer>
  );
}
