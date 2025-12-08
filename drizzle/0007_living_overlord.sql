ALTER TABLE `users` ADD `onboardingCompleted` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `experienceLevel` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `learningGoals` text;--> statement-breakpoint
ALTER TABLE `users` ADD `interests` text;