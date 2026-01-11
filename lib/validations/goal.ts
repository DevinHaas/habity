import { z } from "zod";

export const criteriaTypes = ["coins", "streak", "completions", "level"] as const;

export const goalFormSchema = z.object({
  name: z.string().min(1, "Goal name is required").max(50, "Name too long"),
  category: z.string().max(30, "Category too long").default(""),
  imageUrl: z.string().url().optional().or(z.literal("")),
  criteriaType: z.enum(criteriaTypes, {
    required_error: "Please select a criteria type",
  }),
  targetValue: z
    .number({ required_error: "Target value is required" })
    .min(1, "Target must be at least 1"),
  habitId: z.string().optional(),
});

export type GoalFormValues = z.infer<typeof goalFormSchema>;

export const DEFAULT_GOAL_FORM_VALUES: GoalFormValues = {
  name: "",
  category: "",
  imageUrl: "",
  criteriaType: "coins",
  targetValue: 1000,
  habitId: undefined,
};

// Helper to get criteria type label
export function getCriteriaLabel(type: typeof criteriaTypes[number]): string {
  const labels: Record<typeof criteriaTypes[number], string> = {
    coins: "Coins Collected",
    streak: "Day Streak",
    completions: "Total Completions",
    level: "Level Reached",
  };
  return labels[type];
}

// Helper to get criteria unit
export function getCriteriaUnit(type: typeof criteriaTypes[number]): string {
  const units: Record<typeof criteriaTypes[number], string> = {
    coins: "coins",
    streak: "days",
    completions: "times",
    level: "level",
  };
  return units[type];
}
