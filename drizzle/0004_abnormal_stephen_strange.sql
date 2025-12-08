ALTER TABLE `user_progress` MODIFY COLUMN `last_accessed_at` timestamp;--> statement-breakpoint
ALTER TABLE `user_progress` ADD `time_spent_minutes` int DEFAULT 0 NOT NULL;