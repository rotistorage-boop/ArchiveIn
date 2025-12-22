ALTER TABLE `gallery_item` RENAME COLUMN "year_taken" TO "date";--> statement-breakpoint
DROP INDEX "user_username_unique";--> statement-breakpoint
ALTER TABLE `gallery_item` ALTER COLUMN "date" TO "date" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);