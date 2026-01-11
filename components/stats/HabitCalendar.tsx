"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
} from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { HabitCompletion } from "@/hooks/useHabits";

interface HabitCalendarProps {
  getCompletionsForDate: (date: Date) => HabitCompletion[];
  totalHabits: number;
}

export function HabitCalendar({
  getCompletionsForDate,
  totalHabits,
}: HabitCalendarProps) {
  const [month, setMonth] = React.useState<Date>(new Date());
  const defaultClassNames = getDefaultClassNames();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl bg-card border border-border p-4 shadow-sm"
    >
      <DayPicker
        mode="single"
        month={month}
        onMonthChange={setMonth}
        showOutsideDays={true}
        className={cn(
          "w-full bg-transparent p-0 [--cell-size:--spacing(10)]",
        )}
        classNames={{
          root: cn("w-full", defaultClassNames.root),
          months: cn(
            "flex gap-4 flex-col relative w-full",
            defaultClassNames.months
          ),
          month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
          nav: cn(
            "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
            defaultClassNames.nav
          ),
          button_previous: cn(
            buttonVariants({ variant: "ghost" }),
            "size-8 p-0 select-none hover:bg-muted",
            defaultClassNames.button_previous
          ),
          button_next: cn(
            buttonVariants({ variant: "ghost" }),
            "size-8 p-0 select-none hover:bg-muted",
            defaultClassNames.button_next
          ),
          month_caption: cn(
            "flex items-center justify-center h-8 w-full px-8",
            defaultClassNames.month_caption
          ),
          caption_label: cn(
            "select-none font-semibold text-foreground text-base",
            defaultClassNames.caption_label
          ),
          weekdays: cn("flex w-full", defaultClassNames.weekdays),
          weekday: cn(
            "text-muted-foreground flex-1 font-medium text-xs select-none text-center py-2",
            defaultClassNames.weekday
          ),
          week: cn("flex w-full gap-1", defaultClassNames.week),
          day: cn(
            "relative flex-1 p-0.5 text-center select-none",
            defaultClassNames.day
          ),
          outside: cn(
            "text-muted-foreground/40",
            defaultClassNames.outside
          ),
          disabled: cn(
            "text-muted-foreground opacity-50",
            defaultClassNames.disabled
          ),
          hidden: cn("invisible", defaultClassNames.hidden),
          today: cn(
            "font-bold",
            defaultClassNames.today
          ),
        }}
        components={{
          Root: ({ className, rootRef, ...props }) => {
            return (
              <div
                data-slot="calendar"
                ref={rootRef}
                className={cn(className, "w-full")}
                {...props}
              />
            );
          },
          Chevron: ({ className, orientation, ...props }) => {
            if (orientation === "left") {
              return (
                <ChevronLeftIcon className={cn("size-4 text-muted-foreground", className)} {...props} />
              );
            }
            return (
              <ChevronRightIcon
                className={cn("size-4 text-muted-foreground", className)}
                {...props}
              />
            );
          },
          DayButton: (props) => (
            <HabitDayButton
              {...props}
              getCompletionsForDate={getCompletionsForDate}
              totalHabits={totalHabits}
            />
          ),
        }}
      />
    </motion.div>
  );
}

interface HabitDayButtonProps extends React.ComponentProps<typeof DayButton> {
  getCompletionsForDate: (date: Date) => HabitCompletion[];
  totalHabits: number;
}

function HabitDayButton({
  className,
  day,
  modifiers,
  getCompletionsForDate,
  totalHabits,
  ...props
}: HabitDayButtonProps) {
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef<HTMLButtonElement>(null);
  
  const completions = getCompletionsForDate(day.date);
  const percentage = totalHabits > 0 ? Math.round((completions.length / totalHabits) * 100) : 0;
  const isComplete = percentage === 100;
  const isToday = modifiers.today;
  const isOutside = modifiers.outside;
  const hasActivity = completions.length > 0;

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  // Format date consistently to avoid hydration mismatches
  const formatDateString = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Get progress bar color based on percentage
  const getProgressColor = () => {
    if (percentage === 100) return "bg-emerald-500";
    if (percentage >= 75) return "bg-emerald-400";
    if (percentage >= 50) return "bg-amber-400";
    if (percentage >= 25) return "bg-orange-400";
    return "bg-orange-300";
  };

  return (
    <button
      ref={ref}
      data-day={formatDateString(day.date)}
      className={cn(
        "flex flex-col items-center justify-between w-full aspect-square p-1 rounded-lg transition-all",
        isComplete && "bg-emerald-500/20 ring-1 ring-emerald-500/30",
        !isComplete && hasActivity && "bg-muted/50",
        !isComplete && !hasActivity && "hover:bg-muted/30",
        isToday && !isComplete && "ring-2 ring-primary/50",
        isOutside && "opacity-30",
        defaultClassNames.day,
        className
      )}
      {...props}
    >
      {/* Date number */}
      <span className={cn(
        "text-sm font-medium leading-none mt-0.5",
        isToday && "text-primary font-bold",
        isComplete && "text-emerald-700 dark:text-emerald-300",
        !isToday && !isComplete && "text-foreground"
      )}>
        {day.date.getDate()}
      </span>
      
      {/* Percentage & Progress bar */}
      <div className="w-full mt-auto space-y-0.5">
        {hasActivity && (
          <>
            <span className={cn(
              "text-[10px] font-medium leading-none block text-center",
              isComplete ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
            )}>
              {percentage}%
            </span>
            <div className="h-1 w-full rounded-full bg-muted/50 overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", getProgressColor())}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </>
        )}
      </div>
    </button>
  );
}
