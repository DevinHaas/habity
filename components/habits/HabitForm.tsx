"use client";

import { useForm } from "@tanstack/react-form";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Sun, SunDim, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  DEFAULT_HABIT_FORM_VALUES,
  type HabitFormValues,
} from "@/lib/validations/habit";
import { useFeedback } from "@/hooks";
import { useState, useMemo } from "react";

const DAYS = [
  { label: "M", value: 0 },
  { label: "T", value: 1 },
  { label: "W", value: 2 },
  { label: "T", value: 3 },
  { label: "F", value: 4 },
  { label: "S", value: 5 },
  { label: "S", value: 6 },
];

const DURATIONS = [
  "5 min",
  "10 min",
  "15 min",
  "20 min",
  "30 min",
  "45 min",
  "1 hour",
];

const ICONS = ["✨", "💧", "🧘", "🏃", "📚", "🎨", "🎵", "💪", "🌱", "☀️"];

const TIME_OF_DAY_OPTIONS = [
  { value: "morning" as const, label: "Morning", icon: Sun },
  { value: "day" as const, label: "Day", icon: SunDim },
  { value: "evening" as const, label: "Evening", icon: Moon },
];

interface HabitFormProps {
  onSubmit: (values: HabitFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialValues?: Partial<HabitFormValues>;
  isEditMode?: boolean;
}

export function HabitForm({ 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  initialValues,
  isEditMode = false,
}: HabitFormProps) {
  const { onHabitAdded } = useFeedback();
  const [showCalendar, setShowCalendar] = useState(false);

  const defaultValues = useMemo(() => {
    if (initialValues) {
      return {
        ...DEFAULT_HABIT_FORM_VALUES,
        ...initialValues,
      };
    }
    return DEFAULT_HABIT_FORM_VALUES;
  }, [initialValues]);

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      // Basic validation
      if (!value.name.trim()) {
        return;
      }
      if (value.repeatDays.length === 0) {
        return;
      }
      if (!isEditMode) {
        onHabitAdded();
      }
      onSubmit(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >

      {/* Habit Name */}
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) =>
            !value.trim() ? "Habit name is required" : undefined,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="name" className="text-muted-foreground">
              Name your habit
            </Label>
            <Input
              id="name"
              placeholder="Morning Meditations"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="bg-background border-border rounded-xl h-12"
            />
            {field.state.meta.isTouched && field.state.meta.errors?.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Icon Selection */}
      <form.Field name="icon">
        {(field) => (
          <div className="space-y-2">
            <Label className="text-muted-foreground">Choose an icon</Label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((icon) => (
                <motion.button
                  key={icon}
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => field.handleChange(icon)}
                  className={cn(
                    "h-10 w-10 rounded-lg text-xl flex items-center justify-center transition-colors",
                    field.state.value === icon
                      ? "bg-primary/20 ring-2 ring-primary"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  {icon}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </form.Field>

      {/* Goal Toggle */}
      <form.Field name="hasGoal">
        {(field) => (
          <div className="flex items-center justify-between">
            <Label htmlFor="hasGoal" className="text-foreground">
              Set a goal
            </Label>
            <Switch
              id="hasGoal"
              checked={field.state.value}
              onCheckedChange={field.handleChange}
            />
          </div>
        )}
      </form.Field>

      {/* Goal Date & Amount (conditional) */}
      <form.Subscribe selector={(state) => state.values.hasGoal}>
        {(hasGoal) =>
          hasGoal && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-4"
            >
              <form.Field name="goalDate">
                {(field) => (
                  <div className="flex-1 space-y-2 relative">
                    <Label className="text-muted-foreground text-sm">
                      Add date
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="w-full justify-start text-left font-normal h-12 rounded-xl"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.state.value
                        ? field.state.value.toLocaleDateString()
                        : "Pick a date"}
                    </Button>
                    {showCalendar && (
                      <div className="absolute z-50 bg-card border rounded-xl shadow-lg p-2 mt-1">
                        <Calendar
                          mode="single"
                          selected={field.state.value}
                          onSelect={(date) => {
                            field.handleChange(date);
                            setShowCalendar(false);
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field name="goalAmount">
                {(field) => (
                  <div className="flex-1 space-y-2">
                    <Label className="text-muted-foreground text-sm">
                      Add amount
                    </Label>
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 time</SelectItem>
                        <SelectItem value="2">2 times</SelectItem>
                        <SelectItem value="3">3 times</SelectItem>
                        <SelectItem value="5">5 times</SelectItem>
                        <SelectItem value="10">10 times</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </form.Field>
            </motion.div>
          )
        }
      </form.Subscribe>

      {/* Duration */}
      <form.Field name="duration">
        {(field) => (
          <div className="space-y-2">
            <Label className="text-muted-foreground">Duration</Label>
            <Select value={field.state.value} onValueChange={field.handleChange}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DURATIONS.map((duration) => (
                  <SelectItem key={duration} value={duration}>
                    {duration}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </form.Field>

      {/* Time of Day */}
      <form.Field name="timeOfDay">
        {(field) => (
          <div className="space-y-2">
            <Label className="text-foreground">Time of day</Label>
            <div className="flex gap-2">
              {TIME_OF_DAY_OPTIONS.map((option) => {
                const isSelected = field.state.value === option.value;
                const Icon = option.icon;
                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => field.handleChange(option.value)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-medium transition-colors",
                      isSelected
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {option.label}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </form.Field>

      {/* Repeat Days */}
      <form.Field
        name="repeatDays"
        validators={{
          onChange: ({ value }) =>
            value.length === 0 ? "Select at least one day" : undefined,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-foreground">Repeat days</Label>
            </div>
            <div className="flex justify-between gap-2">
              {DAYS.map((day) => {
                const isSelected = field.state.value.includes(day.value);
                return (
                  <motion.button
                    key={day.value}
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      if (isSelected) {
                        field.handleChange(
                          field.state.value.filter((d) => d !== day.value)
                        );
                      } else {
                        field.handleChange([...field.state.value, day.value]);
                      }
                    }}
                    className={cn(
                      "h-10 w-10 rounded-full text-sm font-medium transition-colors",
                      isSelected
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {day.label}
                  </motion.button>
                );
              })}
            </div>
            {field.state.meta.isTouched && field.state.meta.errors?.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Reminders Toggle */}
      <form.Field name="reminders">
        {(field) => (
          <div className="flex items-center justify-between">
            <Label htmlFor="reminders" className="text-foreground">
              Get reminders
            </Label>
            <Switch
              id="reminders"
              checked={field.state.value}
              onCheckedChange={field.handleChange}
            />
          </div>
        )}
      </form.Field>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold disabled:opacity-50"
      >
        {isSubmitting 
          ? (isEditMode ? "Updating..." : "Saving...") 
          : (isEditMode ? "Update Habit" : "Save Habit")
        }
      </Button>
    </form>
  );
}
