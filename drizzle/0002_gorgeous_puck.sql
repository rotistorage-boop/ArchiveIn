ALTER TABLE `user` ADD `email` text;--> statement-breakpoint
UPDATE `user` SET `email` = '';--> statement-breakpoint
ALTER TABLE `user` ADD `role` text DEFAULT 'user' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);