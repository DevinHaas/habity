DROP INDEX "habits_userId_idx";--> statement-breakpoint
DROP INDEX "habits_name_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "habits_userId_name_unique_idx" ON "habits" USING btree ("user_id","name");