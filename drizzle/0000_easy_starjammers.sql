CREATE TABLE `account_deletion_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`status` text DEFAULT 'requested' NOT NULL,
	`requested_at` integer NOT NULL,
	`completed_at` integer,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_account_deletion_requests_account_status` ON `account_deletion_requests` (`account_id`,`status`);--> statement-breakpoint
CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_type` text NOT NULL,
	`email` text,
	`email_verified` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_accounts_email` ON `accounts` (`email`);--> statement-breakpoint
CREATE INDEX `idx_accounts_status` ON `accounts` (`status`);--> statement-breakpoint
CREATE TABLE `auth_identities` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider` text NOT NULL,
	`provider_subject` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_auth_identities_provider_subject` ON `auth_identities` (`provider`,`provider_subject`);--> statement-breakpoint
CREATE INDEX `idx_auth_identities_account_id` ON `auth_identities` (`account_id`);--> statement-breakpoint
CREATE TABLE `parental_consents` (
	`id` text PRIMARY KEY NOT NULL,
	`parent_account_id` text NOT NULL,
	`child_player_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`method` text,
	`notice_version` text NOT NULL,
	`evidence_reference` text,
	`requested_at` integer NOT NULL,
	`verified_at` integer,
	`revoked_at` integer,
	FOREIGN KEY (`parent_account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`child_player_id`) REFERENCES `player_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_parental_consents_parent_account_id` ON `parental_consents` (`parent_account_id`);--> statement-breakpoint
CREATE INDEX `idx_parental_consents_child_player_id` ON `parental_consents` (`child_player_id`);--> statement-breakpoint
CREATE INDEX `idx_parental_consents_status` ON `parental_consents` (`status`);--> statement-breakpoint
CREATE TABLE `player_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_account_id` text NOT NULL,
	`is_child_account` integer DEFAULT false NOT NULL,
	`age_band` text NOT NULL,
	`display_name` text,
	`public_alias` text,
	`leaderboard_opt_in` integer DEFAULT false NOT NULL,
	`avatar_id` text DEFAULT 'avatar-01' NOT NULL,
	`consent_status` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`owner_account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_player_profiles_owner_account_id` ON `player_profiles` (`owner_account_id`);--> statement-breakpoint
CREATE INDEX `idx_player_profiles_child_consent` ON `player_profiles` (`is_child_account`,`consent_status`);--> statement-breakpoint
CREATE INDEX `idx_player_profiles_public_leaderboard` ON `player_profiles` (`leaderboard_opt_in`,`is_child_account`);--> statement-breakpoint
CREATE TABLE `privacy_events` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text,
	`player_id` text,
	`event_type` text NOT NULL,
	`notice_version` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`player_id`) REFERENCES `player_profiles`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_privacy_events_account_id_created_at` ON `privacy_events` (`account_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_privacy_events_player_id_created_at` ON `privacy_events` (`player_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `sport_progress` (
	`player_id` text NOT NULL,
	`sport_id` text NOT NULL,
	`experience` text,
	`variant` text,
	`xp` integer DEFAULT 0 NOT NULL,
	`completed_modules` text DEFAULT '[]' NOT NULL,
	`mastery` text DEFAULT '{}' NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`player_id`, `sport_id`),
	FOREIGN KEY (`player_id`) REFERENCES `player_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_sport_progress_player_id` ON `sport_progress` (`player_id`);--> statement-breakpoint
PRAGMA optimize;
