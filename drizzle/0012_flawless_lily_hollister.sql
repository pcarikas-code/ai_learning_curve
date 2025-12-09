ALTER TABLE `users` ADD `emailNotifications` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `notifyOnModuleComplete` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `notifyOnQuizResult` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `notifyOnPathComplete` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `notifyOnNewContent` int DEFAULT 1 NOT NULL;