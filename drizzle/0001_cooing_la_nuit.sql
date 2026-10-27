CREATE TABLE `data_export_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`status` text DEFAULT 'requested' NOT NULL,
	`requested_at` integer NOT NULL,
	`completed_at` integer,
	`expires_at` integer,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_data_export_requests_account_status` ON `data_export_requests` (`account_id`,`status`);--> statement-breakpoint
CREATE TABLE `legal_acceptances` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`player_id` text,
	`privacy_version` text NOT NULL,
	`terms_version` text NOT NULL,
	`actor_type` text NOT NULL,
	`acceptance_scope` text NOT NULL,
	`accepted_at` integer NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`player_id`) REFERENCES `player_profiles`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_legal_acceptances_account_id_accepted_at` ON `legal_acceptances` (`account_id`,`accepted_at`);--> statement-breakpoint
CREATE INDEX `idx_legal_acceptances_player_id_accepted_at` ON `legal_acceptances` (`player_id`,`accepted_at`);--> statement-breakpoint
CREATE TABLE `module_completions` (
	`player_id` text NOT NULL,
	`module_id` text NOT NULL,
	`sport_id` text NOT NULL,
	`content_version` text NOT NULL,
	`client_submission_id` text NOT NULL,
	`question_count` integer NOT NULL,
	`correct_count` integer NOT NULL,
	`xp_awarded` integer NOT NULL,
	`completed_at` integer NOT NULL,
	PRIMARY KEY(`player_id`, `module_id`),
	FOREIGN KEY (`player_id`) REFERENCES `player_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_module_completions_submission_id` ON `module_completions` (`client_submission_id`);--> statement-breakpoint
CREATE INDEX `idx_module_completions_player_completed_at` ON `module_completions` (`player_id`,`completed_at`);--> statement-breakpoint
CREATE TABLE `product_metrics_daily` (
	`day` text NOT NULL,
	`event_name` text NOT NULL,
	`age_band` text NOT NULL,
	`surface` text NOT NULL,
	`sport_id` text DEFAULT 'all' NOT NULL,
	`module_id` text DEFAULT 'all' NOT NULL,
	`outcome` text DEFAULT 'all' NOT NULL,
	`event_count` integer DEFAULT 0 NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`day`, `event_name`, `age_band`, `surface`, `sport_id`, `module_id`, `outcome`)
);
--> statement-breakpoint
CREATE INDEX `idx_product_metrics_daily_day_event` ON `product_metrics_daily` (`day`,`event_name`);