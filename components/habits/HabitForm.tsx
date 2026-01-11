"use client";

import { useForm } from "@tanstack/react-form";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon } from "lucide-react";
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
import { useState } from "react";

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

interface HabitFormProps {
  onSubmit: (values: HabitFormValues) => void;
  onCancel: () => void;
}

export function HabitForm({ onSubmit, onCancel }: HabitFormProps) {
  const { onHabitAdded } = useFeedback();
  const [showCalendar, setShowCalendar] = useState(false);

  const form = useForm({
    defaultValues: DEFAULT_HABIT_FORM_VALUES,
    onSubmit: async ({ value }) => {
      // Basic validation
      if (!value.name.trim()) {
        return;
      }
      if (value.repeatDays.length === 0) {
        return;
      }
      onHabitAdded();
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
      {/* Illustration */}
      <div className="flex justify-center py-4">
        <div className="relative">
          <svg viewBox="0 0 120 100" className="w-32 h-28">
            {/* Calendar body */}
            <rect
              x="20"
              y="20"
              width="80"
              height="70"
              rx="8"
              fill="#A8D5AA"
              stroke="#7CB47E"
              strokeWidth="2"
            />
            {/* Calendar top */}
            <rect x="20" y="20" width="80" height="20" rx="8" fill="#7CB47E" />
            <rect x="20" y="32" width="80" height="8" fill="#7CB47E" />
            {/* Calendar rings */}
            <rect x="35" y="12" width="6" height="16" rx="3" fill="#5A9B5C" />
            <rect x="79" y="12" width="6" height="16" rx="3" fill="#5A9B5C" />
            {/* Calendar dots (grid) */}
            {[0, 1, 2, 3].map((row) =>
              [0, 1, 2, 3].map((col) => (
                <rect
                  key={`${row}-${col}`}
                  x={32 + col * 16}
                  y={48 + row * 10}
                  width="10"
                  height="6"
                  rx="2"
                  fill="#E8F5E9"
                />
              ))
            )}
            {/* Decorative swirl */}
            <path
              d="M95 15 Q105 5 110 15 Q115 25 105 30"
              fill="none"
              stroke="#C17F59"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Decorative leaves */}
            <path d="M105 5 Q115 0 110 10" fill="#8B9A46" />
            <path d="M108 8 Q118 5 112 15" fill="#6B7A36" />
          </svg>
        </div>
      </div>

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
        className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold"
      >
        Save Habit
      </Button>
    </form>
  );
}
