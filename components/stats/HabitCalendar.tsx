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
import { isHabitActiveOnDate, type Habit, type HabitCompletion } from "@/lib/habits-utils";

type TimePeriod = "weekly" | "monthly" | "yearly";

interface HabitCalendarProps {
  getCompletionsForDate: (date: Date) => HabitCompletion[];
  habits: Habit[];
  timePeriod: TimePeriod;
  onDayClick?: (date: Date) => void;
}

export function HabitCalendar({
  getCompletionsForDate,
  habits,
  timePeriod,
  onDayClick,
}: HabitCalendarProps) {
  const [month, setMonth] = React.useState<Date>(new Date());
  const [year, setYear] = React.useState<number>(new Date().getFullYear());

  if (timePeriod === "weekly") {
    return (
      <WeeklyCalendar
        getCompletionsForDate={getCompletionsForDate}
        habits={habits}
        onDayClick={onDayClick}
      />
    );
  }

  if (timePeriod === "yearly") {
    return (
      <YearlyHeatmap
        year={year}
        onYearChange={setYear}
        getCompletionsForDate={getCompletionsForDate}
        habits={habits}
        onDayClick={onDayClick}
      />
    );
  }

  return (
    <MonthlyCalendar
      month={month}
      onMonthChange={setMonth}
      getCompletionsForDate={getCompletionsForDate}
      habits={habits}
      onDayClick={onDayClick}
    />
  );
}

// ============ WEEKLY CALENDAR ============
interface WeeklyCalendarProps {
  getCompletionsForDate: (date: Date) => HabitCompletion[];
  habits: Habit[];
  onDayClick?: (date: Date) => void;
}

function WeeklyCalendar({ getCompletionsForDate, habits, onDayClick }: WeeklyCalendarProps) {
  const [weekStart, setWeekStart] = React.useState<Date>(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
    return new Date(today.setDate(diff));
  });

  const weekDays = React.useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      days.push(date);
    }
    return days;
  }, [weekStart]);

  const goToPrevWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(weekStart.getDate() - 7);
    setWeekStart(newStart);
  };

  const goToNextWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(weekStart.getDate() + 7);
    setWeekStart(newStart);
  };

  const formatWeekRange = () => {
    const endDate = new Date(weekStart);
    endDate.setDate(weekStart.getDate() + 6);
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    return `${weekStart.toLocaleDateString("en-US", options)} - ${endDate.toLocaleDateString("en-US", options)}`;
  };

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl bg-card border border-border p-4 shadow-sm"
    >
      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrevWeek}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "size-8 p-0 hover:bg-muted"
          )}
        >
          <ChevronLeftIcon className="size-4 text-muted-foreground" />
        </button>
        <span className="font-semibold text-foreground text-sm">
          {formatWeekRange()}
        </span>
        <button
          onClick={goToNextWeek}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "size-8 p-0 hover:bg-muted"
          )}
        >
          <ChevronRightIcon className="size-4 text-muted-foreground" />
        </button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((date, index) => {
          const completions = getCompletionsForDate(date);
          const hasFailed = completions.some((c) => c.status === "failed");
          const doneCount = completions.filter((c) => c.status !== "failed").length;
          const isFailedOnly = hasFailed && doneCount === 0;
          const totalHabits = habits.filter((h) => isHabitActiveOnDate(h, date)).length;
          const percentage = totalHabits > 0 ? Math.round((doneCount / totalHabits) * 100) : 0;
          const isComplete = percentage === 100;
          const hasActivity = completions.length > 0;
          const isToday = isSameDay(date, new Date());

          return (
            <button
              key={index}
              onClick={() => onDayClick?.(date)}
              className={cn(
                "flex flex-col items-center p-2 rounded-xl transition-all",
                isComplete && "bg-emerald-500/20 ring-1 ring-emerald-500/30",
                isFailedOnly && "bg-red-500/15 ring-1 ring-red-500/25",
                !isComplete && !isFailedOnly && hasActivity && "bg-muted/50",
                !isComplete && !isFailedOnly && !hasActivity && "bg-muted/20 hover:bg-muted/40",
                isToday && !isComplete && !isFailedOnly && "ring-2 ring-primary/50"
              )}
            >
              <span className="text-xs text-muted-foreground mb-1">
                {dayNames[index]}
              </span>
              <span className={cn(
                "text-lg font-semibold mb-2",
                isToday && !isFailedOnly && "text-primary",
                isComplete && "text-emerald-600 dark:text-emerald-400",
                isFailedOnly && "text-red-500 dark:text-red-400"
              )}>
                {date.getDate()}
              </span>

              {/* Progress Circle */}
              <div className="relative size-10">
                <svg className="size-10 -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    className="stroke-muted"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    className={cn(
                      "transition-all duration-300",
                      isFailedOnly ? "stroke-red-500" :
                      percentage === 100 ? "stroke-emerald-500" :
                      percentage >= 75 ? "stroke-emerald-400" :
                      percentage >= 50 ? "stroke-amber-400" :
                      percentage >= 25 ? "stroke-orange-400" :
                      "stroke-orange-300"
                    )}
                    strokeWidth="3"
                    strokeDasharray={isFailedOnly ? "94 100" : `${percentage * 0.94} 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className={cn(
                  "absolute inset-0 flex items-center justify-center text-[10px] font-medium",
                  isComplete ? "text-emerald-600 dark:text-emerald-400" :
                  isFailedOnly ? "text-red-500 dark:text-red-400" :
                  "text-muted-foreground"
                )}>
                  {isFailedOnly ? "0%" : `${percentage}%`}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ============ MONTHLY CALENDAR ============
interface MonthlyCalendarProps {
  month: Date;
  onMonthChange: (date: Date) => void;
  getCompletionsForDate: (date: Date) => HabitCompletion[];
  habits: Habit[];
  onDayClick?: (date: Date) => void;
}

function MonthlyCalendar({
  month,
  onMonthChange,
  getCompletionsForDate,
  habits,
  onDayClick,
}: MonthlyCalendarProps) {
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
        onMonthChange={onMonthChange}
        onSelect={(date) => date && onDayClick?.(date)}
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
              habits={habits}
            />
          ),
        }}
      />
    </motion.div>
  );
}

// ============ YEARLY HEATMAP ============
interface YearlyHeatmapProps {
  year: number;
  onYearChange: (year: number) => void;
  getCompletionsForDate: (date: Date) => HabitCompletion[];
  habits: Habit[];
  onDayClick?: (date: Date) => void;
}

function YearlyHeatmap({
  year,
  onYearChange,
  getCompletionsForDate,
  habits,
  onDayClick,
}: YearlyHeatmapProps) {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Fixed 31 cells per row (max days in any month)
  const CELLS_PER_ROW = 31;

  // Get all days in each month, padded to 31
  const getMonthDays = (monthIndex: number) => {
    const days: (Date | null)[] = [];
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, monthIndex, day));
    }
    // Pad with nulls to make exactly 31 cells
    while (days.length < CELLS_PER_ROW) {
      days.push(null);
    }
    return days;
  };

  // 4 states: 0 = empty, 1 = partial/orange, 2 = complete/green, 3 = failed/red
  const getCompletionState = (date: Date): number => {
    const completions = getCompletionsForDate(date);
    const totalHabits = habits.filter((h) => isHabitActiveOnDate(h, date)).length;
    if (totalHabits === 0 || completions.length === 0) return 0;
    const hasDone = completions.some((c) => c.status !== "failed");
    const hasFailed = completions.some((c) => c.status === "failed");
    if (!hasDone && hasFailed) return 3;
    const doneCount = completions.filter((c) => c.status !== "failed").length;
    if (doneCount >= totalHabits) return 2;
    return 1;
  };

  const getStateColor = (state: number, isToday: boolean) => {
    const baseColor = (() => {
      switch (state) {
        case 0: return "bg-muted/40";
        case 1: return "bg-orange-400 dark:bg-orange-500";
        case 2: return "bg-emerald-500 dark:bg-emerald-400";
        case 3: return "bg-red-500 dark:bg-red-400";
        default: return "bg-muted/40";
      }
    })();

    if (isToday) {
      return cn(baseColor, "ring-2 ring-primary ring-offset-1 ring-offset-card");
    }
    return baseColor;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl bg-card border border-border p-4 shadow-sm"
    >
      {/* Year Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onYearChange(year - 1)}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "size-8 p-0 hover:bg-muted"
          )}
        >
          <ChevronLeftIcon className="size-4 text-muted-foreground" />
        </button>
        <span className="font-semibold text-foreground text-base">
          {year}
        </span>
        <button
          onClick={() => onYearChange(year + 1)}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "size-8 p-0 hover:bg-muted"
          )}
        >
          <ChevronRightIcon className="size-4 text-muted-foreground" />
        </button>
      </div>

      {/* Heatmap Grid */}
      <div className="space-y-1.5">
        {monthNames.map((monthName, monthIndex) => {
          const days = getMonthDays(monthIndex);
          const today = new Date();
          
          return (
            <div key={monthIndex} className="flex items-center gap-2">
              {/* Month Label */}
              <span className="text-[10px] text-muted-foreground w-7 shrink-0">
                {monthName}
              </span>
              
              {/* Days Grid - exactly 31 cells per row */}
              <div className="grid grid-cols-[repeat(31,1fr)] gap-[2px] flex-1">
                {days.map((date, dayIndex) => {
                  if (!date) {
                    // Empty placeholder cell
                    return (
                      <div
                        key={dayIndex}
                        className="aspect-square rounded-[2px] bg-transparent"
                      />
                    );
                  }
                  
                  const state = getCompletionState(date);
                  const isToday = isSameDay(date, today);
                  const isFuture = date > today;
                  
                  return (
                    <button
                      key={dayIndex}
                      onClick={() => !isFuture && onDayClick?.(date)}
                      disabled={isFuture}
                      className={cn(
                        "aspect-square rounded-[2px] transition-all",
                        isFuture ? "bg-muted/20 cursor-default" : cn(getStateColor(state, isToday), "hover:opacity-75")
                      )}
                      title={`${date.toLocaleDateString()}: ${
                        state === 0 ? 'Not done' :
                        state === 1 ? 'Partially done' :
                        'Complete'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="size-[10px] rounded-[2px] bg-muted/40" />
          <span>Empty</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-[10px] rounded-[2px] bg-orange-400 dark:bg-orange-500" />
          <span>Partial</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-[10px] rounded-[2px] bg-emerald-500 dark:bg-emerald-400" />
          <span>Done</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-[10px] rounded-[2px] bg-red-500 dark:bg-red-400" />
          <span>Failed</span>
        </div>
      </div>
    </motion.div>
  );
}

// ============ HELPER COMPONENTS ============
interface HabitDayButtonProps extends React.ComponentProps<typeof DayButton> {
  getCompletionsForDate: (date: Date) => HabitCompletion[];
  habits: Habit[];
}

function HabitDayButton({
  className,
  day,
  modifiers,
  getCompletionsForDate,
  habits,
  ...props
}: HabitDayButtonProps) {
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef<HTMLButtonElement>(null);

  const completions = getCompletionsForDate(day.date);
  const hasDone = completions.some((c) => c.status !== "failed");
  const hasFailed = completions.some((c) => c.status === "failed");
  const doneCount = completions.filter((c) => c.status !== "failed").length;
  const totalHabits = habits.filter((h) => isHabitActiveOnDate(h, day.date)).length;
  const percentage = totalHabits > 0 ? Math.round((doneCount / totalHabits) * 100) : 0;
  const isComplete = percentage === 100;
  const isFailedOnly = hasFailed && !hasDone;
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
        isFailedOnly && "bg-red-500/15 ring-1 ring-red-500/25",
        !isComplete && !isFailedOnly && hasActivity && "bg-muted/50",
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
        isFailedOnly && "text-red-600 dark:text-red-400",
        !isToday && !isComplete && !isFailedOnly && "text-foreground"
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

// Helper function
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}
