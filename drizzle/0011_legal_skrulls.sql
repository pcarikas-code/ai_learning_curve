CREATE TABLE `path_enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`path_id` int NOT NULL,
	`enrolled_at` timestamp NOT NULL DEFAULT (now()),
	`completed_at` timestamp,
	`progress_percent` int NOT NULL DEFAULT 0,
	`last_accessed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `path_enrollments_id` PRIMARY KEY(`id`)
);
