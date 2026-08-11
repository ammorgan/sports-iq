import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

/**
 * Authentication is intentionally provider-owned. This table stores the adult
 * account record after an external identity provider has verified the user.
 * Passwords and OAuth access tokens never belong in RepQuest's database.
 */
export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  ownerType: text("owner_type", { enum: ["self", "parent"] }).notNull(),
  email: text("email"),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  status: text("status", { enum: ["active", "pending", "disabled", "deletion_requested"] }).notNull().default("pending"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp_ms" }),
}, (table) => [
  uniqueIndex("idx_accounts_email").on(table.email),
  index("idx_accounts_status").on(table.status),
]);

export const authIdentities = sqliteTable("auth_identities", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull().references(() => accounts.id, { onDelete: "cascade" }),
  provider: text("provider", { enum: ["apple", "google", "facebook", "email"] }).notNull(),
  providerSubject: text("provider_subject").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => [
  uniqueIndex("idx_auth_identities_provider_subject").on(table.provider, table.providerSubject),
  index("idx_auth_identities_account_id").on(table.accountId),
]);

/**
 * A player is separate from the adult account that owns it. For a child under
 * 13, owner_account_id points to the parent/guardian, is_child_account is true,
 * and no child email or legal name is stored.
 */
export const playerProfiles = sqliteTable("player_profiles", {
  id: text("id").primaryKey(),
  ownerAccountId: text("owner_account_id").notNull().references(() => accounts.id, { onDelete: "cascade" }),
  isChildAccount: integer("is_child_account", { mode: "boolean" }).notNull().default(false),
  ageBand: text("age_band", { enum: ["7-9", "10-12", "13-15", "16-17", "18+"] }).notNull(),
  displayName: text("display_name"),
  publicAlias: text("public_alias"),
  leaderboardOptIn: integer("leaderboard_opt_in", { mode: "boolean" }).notNull().default(false),
  avatarId: text("avatar_id").notNull().default("avatar-01"),
  consentStatus: text("consent_status", { enum: ["not_required", "pending", "verified", "revoked"] }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp_ms" }),
}, (table) => [
  index("idx_player_profiles_owner_account_id").on(table.ownerAccountId),
  index("idx_player_profiles_child_consent").on(table.isChildAccount, table.consentStatus),
  index("idx_player_profiles_public_leaderboard").on(table.leaderboardOptIn, table.isChildAccount),
]);

export const parentalConsents = sqliteTable("parental_consents", {
  id: text("id").primaryKey(),
  parentAccountId: text("parent_account_id").notNull().references(() => accounts.id, { onDelete: "cascade" }),
  childPlayerId: text("child_player_id").notNull().references(() => playerProfiles.id, { onDelete: "cascade" }),
  status: text("status", { enum: ["pending", "verified", "revoked", "expired"] }).notNull().default("pending"),
  method: text("method"),
  noticeVersion: text("notice_version").notNull(),
  evidenceReference: text("evidence_reference"),
  requestedAt: integer("requested_at", { mode: "timestamp_ms" }).notNull(),
  verifiedAt: integer("verified_at", { mode: "timestamp_ms" }),
  revokedAt: integer("revoked_at", { mode: "timestamp_ms" }),
}, (table) => [
  index("idx_parental_consents_parent_account_id").on(table.parentAccountId),
  index("idx_parental_consents_child_player_id").on(table.childPlayerId),
  index("idx_parental_consents_status").on(table.status),
]);

export const sportProgress = sqliteTable("sport_progress", {
  playerId: text("player_id").notNull().references(() => playerProfiles.id, { onDelete: "cascade" }),
  sportId: text("sport_id").notNull(),
  experience: text("experience", { enum: ["new", "basics", "competitive"] }),
  variant: text("variant"),
  xp: integer("xp").notNull().default(0),
  completedModules: text("completed_modules", { mode: "json" }).$type<string[]>().notNull().default([]),
  mastery: text("mastery", { mode: "json" }).$type<Record<string, { attempts: number; correct: number; recovered: boolean }>>().notNull().default({}),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => [
  primaryKey({ columns: [table.playerId, table.sportId] }),
  index("idx_sport_progress_player_id").on(table.playerId),
]);

export const privacyEvents = sqliteTable("privacy_events", {
  id: text("id").primaryKey(),
  accountId: text("account_id").references(() => accounts.id, { onDelete: "set null" }),
  playerId: text("player_id").references(() => playerProfiles.id, { onDelete: "set null" }),
  eventType: text("event_type", { enum: ["notice_shown", "consent_requested", "consent_verified", "consent_revoked", "deletion_requested", "data_deleted"] }).notNull(),
  noticeVersion: text("notice_version"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => [
  index("idx_privacy_events_account_id_created_at").on(table.accountId, table.createdAt),
  index("idx_privacy_events_player_id_created_at").on(table.playerId, table.createdAt),
]);

export const accountDeletionRequests = sqliteTable("account_deletion_requests", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull().references(() => accounts.id, { onDelete: "cascade" }),
  status: text("status", { enum: ["requested", "processing", "complete", "cancelled"] }).notNull().default("requested"),
  requestedAt: integer("requested_at", { mode: "timestamp_ms" }).notNull(),
  completedAt: integer("completed_at", { mode: "timestamp_ms" }),
}, (table) => [index("idx_account_deletion_requests_account_status").on(table.accountId, table.status)]);
