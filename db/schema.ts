import { pgTable, uuid, text, integer, timestamp, date } from 'drizzle-orm/pg-core';

export const habits = pgTable('habits', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  duration: text('duration'),
  color: text('color').notNull(),
  repeatDays: integer('repeat_days').array().notNull(),
  timeOfDay: text('time_of_day').notNull().default('morning'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const habitCompletions = pgTable('habit_completions', {
  id: uuid('id').primaryKey().defaultRandom(),
  habitId: uuid('habit_id').notNull().references(() => habits.id, { onDelete: 'cascade' }),
  completionDate: date('completion_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const goals = pgTable('goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  category: text('category'),
  imageUrl: text('image_url'),
  emoji: text('emoji').notNull(),
  criteriaType: text('criteria_type').notNull(),
  targetValue: integer('target_value').notNull(),
  habitId: uuid('habit_id').references(() => habits.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userStats = pgTable('user_stats', {
  id: uuid('id').primaryKey().defaultRandom(),
  level: integer('level').notNull().default(1),
  points: integer('points').notNull().default(0),
  totalPoints: integer('total_points').notNull().default(150),
  currentBadge: integer('current_badge').notNull().default(1),
  coins: integer('coins').notNull().default(0),
  totalHabitsCompleted: integer('total_habits_completed').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
