"use client";

import { useEffect, useRef, useState } from "react";
import { motion, Reorder, useDragControls } from "framer-motion";
import { Sun, SunDim, Moon, GripVertical } from "lucide-react";
import { HabitCard } from "@/components/habits/HabitCard";
import type { Habit, TimeOfDay } from "@/lib/habits-utils";

interface TimelineGroupProps {
  timeOfDay: TimeOfDay;
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (id: string) => void;
  onReorderHabits: (orders: { id: string; sortOrder: number }[]) => void;
  completedCount: number;
  totalCount: number;
}

// Long-press anywhere on the row to grab it for reordering — quick taps and
// horizontal swipes (open the edit/delete actions) never get intercepted.
// A held-still-long-enough press picks the row up (reorder); movement past
// DIRECTION_LOCK_PX before that decides the gesture by whichever axis moved
// further — sideways opens the edit/delete actions, up/down reorders.
const LONG_PRESS_MS = 250;
const DIRECTION_LOCK_PX = 8;

const TIME_CONFIG = {
  morning: {
    label: "Morning",
    icon: Sun,
    activeColor: "#F59E0B", // Warm amber for morning
    gradientFrom: "#FDE68A",
    gradientTo: "#F59E0B",
  },
  day: {
    label: "Day",
    icon: SunDim,
    activeColor: "#10B981", // Green for day
    gradientFrom: "#6EE7B7",
    gradientTo: "#10B981",
  },
  evening: {
    label: "Evening",
    icon: Moon,
    activeColor: "#8B5CF6", // Purple for evening
    gradientFrom: "#C4B5FD",
    gradientTo: "#8B5CF6",
  },
};

export function TimelineGroup({
  timeOfDay,
  habits,
  onToggleHabit,
  onEditHabit,
  onDeleteHabit,
  onReorderHabits,
  completedCount,
  totalCount
}: TimelineGroupProps) {
  const config = TIME_CONFIG[timeOfDay];
  const Icon = config.icon;

  // Calculate how many habits are completed for this time group (for display in header)
  const groupCompletedCount = habits.filter(h => h.completed).length;
  const groupTotalCount = habits.length;

  // Local order drives the drag animation; synced from props so completions/edits
  // elsewhere still flow through. Any unrelated re-render (a query refetch, a
  // different habit toggling) hands us a new `habits` array reference, so we
  // must not resync while an item is actively being dragged — otherwise the
  // list snaps back to server order out from under the user's cursor.
  const isDraggingRef = useRef(false);
  const [orderedHabits, setOrderedHabits] = useState(habits);
  const [prevHabits, setPrevHabits] = useState(habits);
  if (habits !== prevHabits && !isDraggingRef.current) {
    setPrevHabits(habits);
    setOrderedHabits(habits);
  }
  const handleDragStart = () => {
    isDraggingRef.current = true;
  };
  const handleDragEnd = () => {
    isDraggingRef.current = false;
    onReorderHabits(
      orderedHabits.map((h, i) => ({ id: h.id, sortOrder: i })),
    );
  };

  if (groupTotalCount === 0) return null;

  return (
    <div className="mb-4">
      {/* Section Header */}
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold text-sm text-foreground">{config.label}</h3>
        <span className="text-xs text-muted-foreground">
          {groupCompletedCount}/{groupTotalCount}
        </span>
      </div>

      {/* Timeline with habits */}
      <div className="relative flex">
        {/* SVG Timeline Path */}
        <div className="absolute left-[10px] top-0 bottom-0 w-6">
          <svg
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`gradient-${timeOfDay}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={config.gradientFrom} />
                <stop offset="100%" stopColor={config.gradientTo} />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Habit Cards with Timeline Nodes */}
        <Reorder.Group
          as="div"
          axis="y"
          values={orderedHabits}
          onReorder={setOrderedHabits}
          className="flex-1 space-y-1.5"
        >
          {orderedHabits.map((habit, index) => (
            <TimelineRow
              key={habit.id}
              habit={habit}
              index={index}
              isLast={index === orderedHabits.length - 1}
              nextCompleted={orderedHabits[index + 1]?.completed ?? false}
              activeColor={config.activeColor}
              onToggleHabit={onToggleHabit}
              onEditHabit={onEditHabit}
              onDeleteHabit={onDeleteHabit}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              completedCount={completedCount}
              totalCount={totalCount}
            />
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
}

interface TimelineRowProps {
  habit: Habit;
  index: number;
  isLast: boolean;
  nextCompleted: boolean;
  activeColor: string;
  onToggleHabit: (id: string) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (id: string) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  completedCount: number;
  totalCount: number;
}

function TimelineRow({
  habit,
  index,
  isLast,
  nextCompleted,
  activeColor,
  onToggleHabit,
  onEditHabit,
  onDeleteHabit,
  onDragStart,
  onDragEnd,
  completedCount,
  totalCount,
}: TimelineRowProps) {
  const isCompleted = habit.completed;
  const controls = useDragControls();
  const swipeControls = useDragControls();

  // Long-press-anywhere-on-the-row grab: a quick tap still hits buttons/the
  // swipe-to-reveal gesture as normal, but holding still for LONG_PRESS_MS
  // picks the row up for reordering, wherever the finger/cursor landed.
  const pressTimerRef = useRef<number | null>(null);
  const pressStartRef = useRef<{ x: number; y: number } | null>(null);
  const cleanupPressRef = useRef<(() => void) | null>(null);

  const cancelPress = () => {
    if (pressTimerRef.current !== null) {
      window.clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    cleanupPressRef.current?.();
    cleanupPressRef.current = null;
  };

  useEffect(() => cancelPress, []);

  const handleRowPointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    // Buttons (checkbox, edit/delete actions) and the dedicated timeline-node
    // handle already manage their own gesture — don't compete with them.
    if (target.closest("button, [data-drag-handle]")) return;

    pressStartRef.current = { x: e.clientX, y: e.clientY };

    const onMove = (moveEvent: PointerEvent) => {
      const start = pressStartRef.current;
      if (!start) return;
      const dx = Math.abs(moveEvent.clientX - start.x);
      const dy = Math.abs(moveEvent.clientY - start.y);
      if (dx < DIRECTION_LOCK_PX && dy < DIRECTION_LOCK_PX) return;

      // Direction is clear before the long-press fires — sideways-dominant
      // movement opens the swipe actions, up/down-dominant grabs for reorder.
      cancelPress();
      if (dx > dy) {
        swipeControls.start(moveEvent);
      } else {
        controls.start(moveEvent);
      }
    };
    const onUp = () => cancelPress();

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
    cleanupPressRef.current = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    pressTimerRef.current = window.setTimeout(() => {
      cleanupPressRef.current?.();
      cleanupPressRef.current = null;
      controls.start(e);
    }, LONG_PRESS_MS);
  };

  return (
    <Reorder.Item
      as="div"
      value={habit}
      dragListener={false}
      dragControls={controls}
      layout="position"
      onPointerDown={handleRowPointerDown}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      whileDrag={{
        scale: 1.03,
        zIndex: 50,
      }}
      className="group relative flex bg-card rounded-xl cursor-grab active:cursor-grabbing"
    >
      {/* Timeline Node and Connector — also a drag handle */}
      <div className="relative z-10 flex flex-col items-center mr-2.5">
        {/* Enlarged, invisible hit target: the visible dot is only ~10px,
            too small to reliably grab, so bleed the draggable area out
            beyond it without affecting layout. Grabs instantly, unlike the
            long-press used by the rest of the row, since nothing else here
            competes for the gesture. */}
        <div
          data-drag-handle
          className="absolute -inset-3 cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={(e) => controls.start(e)}
        />

        {/* Node Circle */}
        <motion.div
          initial={false}
          animate={{
            backgroundColor: isCompleted ? activeColor : "rgb(229 231 235)",
            scale: isCompleted ? 1 : 0.85,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-2.5 h-2.5 rounded-full border-2 border-background shadow-sm mt-4 pointer-events-none"
          style={{
            boxShadow: isCompleted ? `0 0 6px ${activeColor}40` : "none",
          }}
        />

        {/* Connector Line */}
        {!isLast && (
          <motion.div
            initial={false}
            animate={{
              background: isCompleted
                ? `linear-gradient(to bottom, ${activeColor}, ${nextCompleted ? activeColor : 'rgb(229 231 235)'})`
                : "rgb(229 231 235)",
            }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            className="w-0.5 flex-1 min-h-[36px] mt-0.5 pointer-events-none"
          />
        )}
      </div>

      {/* Habit Card */}
      <div className="flex-1">
        <HabitCard
          habit={habit}
          onToggle={onToggleHabit}
          onEdit={onEditHabit}
          onDelete={onDeleteHabit}
          index={index}
          completedCount={completedCount}
          totalCount={totalCount}
          swipeControls={swipeControls}
        />
      </div>

      {/* Visible grip handle — cue that the row can be picked up and
          reordered. Always rendered by default (touch has no hover state to
          reveal it on) — `any-pointer`/`any-hover` misreport inside
          installed PWAs, so gating base visibility on them hid the handle
          on mobile. `hover:hover` here only *dims it by default on devices
          that truly support hover*, revealed on row hover; touch devices
          never match `hover:hover` so they keep it always-on. 44px min hit
          target per platform touch-target specs. */}
      <div
        data-drag-handle
        className="flex w-11 h-11 shrink-0 items-center justify-center text-muted-foreground/40 touch-none cursor-grab active:cursor-grabbing [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-opacity"
        onPointerDown={(e) => controls.start(e)}
      >
        <GripVertical className="h-5 w-5" />
      </div>
    </Reorder.Item>
  );
}
