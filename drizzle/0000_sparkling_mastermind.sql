CREATE TABLE `academic_item` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`mata_kuliah_id` integer NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`hero_image` text,
	`link` text,
	`link_platform` text,
	FOREIGN KEY (`mata_kuliah_id`) REFERENCES `mata_kuliah`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `academic_item_block` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`item_id` integer NOT NULL,
	`type` text NOT NULL,
	`content` text,
	`image_url` text,
	`caption` text,
	`order` integer NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `academic_item`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `asprak` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`mata_kuliah_id` integer NOT NULL,
	FOREIGN KEY (`mata_kuliah_id`) REFERENCES `mata_kuliah`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `gallery_group` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `gallery_item` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`group_id` integer,
	`title` text NOT NULL,
	`description` text,
	`image_url` text NOT NULL,
	`year_taken` integer NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `gallery_group`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `mata_kuliah` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`semester_id` integer NOT NULL,
	`name` text NOT NULL,
	`code` text,
	`dosen` text NOT NULL,
	`jam` text NOT NULL,
	FOREIGN KEY (`semester_id`) REFERENCES `semester`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `praktikum` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`mata_kuliah_id` integer NOT NULL,
	`title` text NOT NULL,
	FOREIGN KEY (`mata_kuliah_id`) REFERENCES `mata_kuliah`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `praktikum_item` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`praktikum_id` integer NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`link` text,
	`link_platform` text,
	FOREIGN KEY (`praktikum_id`) REFERENCES `praktikum`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `praktikum_item_block` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`item_id` integer NOT NULL,
	`type` text NOT NULL,
	`content` text,
	`image_url` text,
	`caption` text,
	`order` integer NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `praktikum_item`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `semester` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`start_year` integer NOT NULL,
	`end_year` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);