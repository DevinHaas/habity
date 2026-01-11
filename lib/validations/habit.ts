import { z } from "zod";

export const timeOfDayEnum = z.enum(["morning", "day", "evening"]);
export type TimeOfDayValue = z.infer<typeof timeOfDayEnum>;

export const habitFormSchema = z.object({
  name: z.string().min(1, "Habit name is required").max(50, "Name too long"),
  icon: z.string().default("✨"),
  hasGoal: z.boolean().default(false),
  goalDate: z.date().optional(),
  goalAmount: z.string().optional(),
  duration: z.string().default("5 min"),
  repeatDays: z
    .array(z.number().min(0).max(6))
    .min(1, "Select at least one day"),
  reminders: z.boolean().default(false),
  color: z.string().default("#E86A33"),
  timeOfDay: timeOfDayEnum.default("morning"),
});

export type HabitFormValues = z.infer<typeof habitFormSchema>;

export const DEFAULT_HABIT_FORM_VALUES: HabitFormValues = {
  name: "",
  icon: "✨",
  hasGoal: false,
  goalDate: undefined,
  goalAmount: undefined,
  duration: "5 min",
  repeatDays: [3], // Thursday selected by default (like mockup)
  reminders: false,
  color: "#E86A33",
  timeOfDay: "morning",
};
