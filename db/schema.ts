import { pgTable, uuid, text, integer, timestamp, date, boolean, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==================== Better Auth Tables ====================

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// ==================== App Tables ====================

export const habits = pgTable('habits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  duration: text('duration'),
  color: text('color').notNull(),
  repeatDays: integer('repeat_days').array().notNull(),
  timeOfDay: text('time_of_day').notNull().default('morning'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [index("habits_userId_idx").on(table.userId)]);

export const habitCompletions = pgTable('habit_completions', {
  id: uuid('id').primaryKey().defaultRandom(),
  habitId: uuid('habit_id').notNull().references(() => habits.id, { onDelete: 'cascade' }),
  completionDate: date('completion_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const goals = pgTable('goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  category: text('category'),
  imageUrl: text('image_url'),
  emoji: text('emoji').notNull(),
  criteriaType: text('criteria_type').notNull(),
  targetValue: integer('target_value').notNull(),
  habitId: uuid('habit_id').references(() => habits.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [index("goals_userId_idx").on(table.userId)]);

// userStats uses userId as the primary key (one stats row per user)
export const userStats = pgTable('user_stats', {
  userId: text('user_id').primaryKey().references(() => user.id, { onDelete: 'cascade' }),
  level: integer('level').notNull().default(1),
  points: integer('points').notNull().default(0),
  totalPoints: integer('total_points').notNull().default(150),
  currentBadge: integer('current_badge').notNull().default(1),
  coins: integer('coins').notNull().default(0),
  totalHabitsCompleted: integer('total_habits_completed').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==================== Relations ====================

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  habits: many(habits),
  goals: many(goals),
  stats: one(userStats),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const habitsRelations = relations(habits, ({ one, many }) => ({
  user: one(user, {
    fields: [habits.userId],
    references: [user.id],
  }),
  completions: many(habitCompletions),
}));

export const habitCompletionsRelations = relations(habitCompletions, ({ one }) => ({
  habit: one(habits, {
    fields: [habitCompletions.habitId],
    references: [habits.id],
  }),
}));

export const goalsRelations = relations(goals, ({ one }) => ({
  user: one(user, {
    fields: [goals.userId],
    references: [user.id],
  }),
  habit: one(habits, {
    fields: [goals.habitId],
    references: [habits.id],
  }),
}));

export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(user, {
    fields: [userStats.userId],
    references: [user.id],
  }),
}));
