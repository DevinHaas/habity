"use client";

import { useForm } from "@tanstack/react-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  DEFAULT_GOAL_FORM_VALUES,
  criteriaTypes,
  getCriteriaLabel,
  getCriteriaUnit,
  type GoalFormValues,
} from "@/lib/validations/goal";
import { useHabits } from "@/hooks";
import { generateEmojiFromName } from "@/hooks/useGoals";
import { useState, useEffect, useCallback } from "react";

interface GoalFormProps {
  onSubmit: (values: GoalFormValues) => void;
  onCancel: () => void;
  initialValues?: Partial<GoalFormValues>;
}

// Quick emoji suggestions
const QUICK_EMOJIS = ["🎧", "👟", "💆", "🎮", "📱", "✈️", "🎁", "💰", "🏆", "🎯"];

export function GoalForm({ onSubmit, onCancel, initialValues }: GoalFormProps) {
  const { habits } = useHabits();
  const [previewEmoji, setPreviewEmoji] = useState<string>("🎯");
  const [customEmoji, setCustomEmoji] = useState<string>("");
  const [currentName, setCurrentName] = useState<string>(initialValues?.name || "");
  const [currentCriteriaType, setCurrentCriteriaType] = useState<typeof criteriaTypes[number]>(
    initialValues?.criteriaType || "coins"
  );

  const form = useForm({
    defaultValues: {
      ...DEFAULT_GOAL_FORM_VALUES,
      ...initialValues,
    },
    onSubmit: async ({ value }) => {
      if (!value.name.trim()) {
        return;
      }
      onSubmit(value);
    },
  });

  // Update preview emoji when name changes
  const handleNameChange = useCallback((name: string) => {
    setCurrentName(name);
    if (name && !customEmoji) {
      setPreviewEmoji(generateEmojiFromName(name));
    }
  }, [customEmoji]);

  useEffect(() => {
    if (currentName && !customEmoji) {
      setPreviewEmoji(generateEmojiFromName(currentName));
    }
  }, [currentName, customEmoji]);

  const needsHabitSelection = currentCriteriaType === "streak" || currentCriteriaType === "completions";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      {/* Preview Card */}
      <div className="flex justify-center py-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-muted"
        >
          <span className="text-5xl">{customEmoji || previewEmoji}</span>
        </motion.div>
      </div>

      {/* Quick Emoji Selection */}
      <div className="space-y-2">
        <Label className="text-muted-foreground">Choose an icon (optional)</Label>
        <div className="flex flex-wrap gap-2">
          {QUICK_EMOJIS.map((emoji) => (
            <motion.button
              key={emoji}
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setCustomEmoji(emoji === customEmoji ? "" : emoji);
              }}
              className={cn(
                "h-10 w-10 rounded-lg text-xl flex items-center justify-center transition-colors",
                customEmoji === emoji
                  ? "bg-primary/20 ring-2 ring-primary"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {emoji}
            </motion.button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Or leave empty to auto-generate based on your goal name
        </p>
      </div>

      {/* Goal Name */}
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) =>
            !value.trim() ? "Goal name is required" : undefined,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="name" className="text-muted-foreground">
              What do you want to reward yourself with?
            </Label>
            <Input
              id="name"
              placeholder="e.g., AirPods Max, Spa Day, New Sneakers"
              value={field.state.value}
              onChange={(e) => {
                field.handleChange(e.target.value);
                handleNameChange(e.target.value);
              }}
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

      {/* Category */}
      <form.Field name="category">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="category" className="text-muted-foreground">
              Category (optional)
            </Label>
            <Input
              id="category"
              placeholder="e.g., Apple, Nike, Self Care"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="bg-background border-border rounded-xl h-12"
            />
          </div>
        )}
      </form.Field>

      {/* Image URL (optional) */}
      <form.Field name="imageUrl">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-muted-foreground">
              Image URL (optional)
            </Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={field.state.value || ""}
              onChange={(e) => field.handleChange(e.target.value)}
              className="bg-background border-border rounded-xl h-12"
            />
            <p className="text-xs text-muted-foreground">
              Add an image URL for your reward, or leave empty to use the emoji
            </p>
          </div>
        )}
      </form.Field>

      {/* Criteria Type */}
      <form.Field name="criteriaType">
        {(field) => (
          <div className="space-y-2">
            <Label className="text-muted-foreground">
              What do you need to achieve?
            </Label>
            <Select
              value={field.state.value}
              onValueChange={(value) => {
                const typedValue = value as typeof criteriaTypes[number];
                field.handleChange(typedValue);
                setCurrentCriteriaType(typedValue);
              }}
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {criteriaTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {getCriteriaLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </form.Field>

      {/* Habit Selection (for streak/completions) */}
      {needsHabitSelection && (
        <form.Field name="habitId">
          {(field) => (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-2"
            >
              <Label className="text-muted-foreground">
                Which habit? (optional)
              </Label>
              <Select
                value={field.state.value || "any"}
                onValueChange={(value) =>
                  field.handleChange(value === "any" ? undefined : value)
                }
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Any habit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any habit (best streak)</SelectItem>
                  {habits.map((habit) => (
                    <SelectItem key={habit.id} value={habit.id}>
                      {habit.icon} {habit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          )}
        </form.Field>
      )}

      {/* Target Value */}
      <form.Field
        name="targetValue"
        validators={{
          onChange: ({ value }) =>
            value < 1 ? "Target must be at least 1" : undefined,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="targetValue" className="text-muted-foreground">
              Target ({getCriteriaUnit(currentCriteriaType)})
            </Label>
            <Input
              id="targetValue"
              type="number"
              min={1}
              placeholder={currentCriteriaType === "coins" ? "10000" : "30"}
              value={field.state.value}
              onChange={(e) => field.handleChange(parseInt(e.target.value) || 0)}
              onBlur={field.handleBlur}
              className="bg-background border-border rounded-xl h-12"
            />
            {field.state.meta.isTouched && field.state.meta.errors?.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors[0]}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {currentCriteriaType === "coins" && "Collect this many coins to unlock your reward"}
              {currentCriteriaType === "streak" && "Maintain this many days in a row"}
              {currentCriteriaType === "completions" && "Complete habits this many times"}
              {currentCriteriaType === "level" && "Reach this level to unlock"}
            </p>
          </div>
        )}
      </form.Field>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold"
      >
        Create Goal
      </Button>

      {/* Cancel Button */}
      <Button
        type="button"
        variant="ghost"
        onClick={onCancel}
        className="w-full h-12 rounded-full text-muted-foreground"
      >
        Cancel
      </Button>
    </form>
  );
}
