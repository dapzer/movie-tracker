import {
  MediaDetailsInfoType,
  MediaItemSiteToViewType,
  MediaItemTvProgressType,
  NotificationMetaType,
} from "@movie-tracker/types"
import { sql } from "drizzle-orm"
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export const mediaListAccessLevelEnum = pgEnum("MediaListAccessLevelEnum", ["PUBLIC", "URL", "PRIVATE"])
export const mediaTypeEnum = pgEnum("MediaTypeEnum", ["movie", "tv"])
export const notificationTypeEnum = pgEnum("NotificationTypeEnum", ["MEDIA_LIST_LIKE", "USER_FOLLOW", "MEDIA_RELEASE", "MEDIA_STATUS_UPDATE"])
export const signUpMethodEnum = pgEnum("SignUpMethodEnum", ["EMAIL", "GOOGLE", "GITHUB", "VK", "YANDEX"])
export const statusNameEnum = pgEnum("StatusNameEnum", ["VIEWED", "WATCHING_NOW", "NOT_VIEWED", "WAIT_NEW_PART"])
export const userMediaRatingsAccessLevelEnum = pgEnum("UserMediaRatingsAccessLevelEnum", ["PUBLIC", "PRIVATE"])
export const userRoleEnum = pgEnum("UserRoleEnum", ["ADMIN", "USER"])
export const mediaReviewStatusEnum = pgEnum("MediaReviewStatusEnum", [
  "DRAFT",
  "PENDING",
  "PUBLISHED",
  "REMOVED",
  "DELETED",
])
export const mediaReviewRemoveReasonEnum = pgEnum("MediaReviewRemoveReasonEnum", [
  "OFF_TOPIC",
  "SPAM",
  "TOXICITY",
  "LOW_EFFORT_JUNK",
  "OTHER",
])

export const prismaMigrations = pgTable("_prisma_migrations", {
  id: varchar({ length: 36 }).primaryKey().notNull(),
  checksum: varchar({ length: 64 }).notNull(),
  finishedAt: timestamp("finished_at", { withTimezone: true, mode: "date" }),
  migrationName: varchar("migration_name", { length: 255 }).notNull(),
  logs: text(),
  rolledBackAt: timestamp("rolled_back_at", { withTimezone: true, mode: "date" }),
  startedAt: timestamp("started_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
  appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
})

export const sessions = pgTable("sessions", {
  id: text().primaryKey().notNull(),
  sid: text().notNull().unique(),
  data: text().notNull(),
  expiresAt: timestamp({ precision: 3, mode: "date", withTimezone: true }).defaultNow().notNull(),
})

export const users = pgTable("users", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text(),
  email: text(),
  image: text(),
  roles: userRoleEnum("roles").array().default(["USER"]).notNull(),
  createdAt: timestamp("created_at", { precision: 3, mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, mode: "date", withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
  isEmailVerified: boolean("is_email_verified").default(false).notNull(),
  password: text(),
  signUpMethod: signUpMethodEnum("sign_up_method").notNull(),
  mediaRatingsAccessLevel: userMediaRatingsAccessLevelEnum("media_ratings_access_level").default("PUBLIC").notNull(),
}, table => [
  uniqueIndex("users_email_lower_unique").on(sql`lower(${table.email})`),
])

export const accounts = pgTable("accounts", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull().references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
  type: text().notNull(),
  provider: text().notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: integer("expires_at"),
  createdAt: timestamp("created_at", { precision: 3, mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, mode: "date", withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}, table => [
  uniqueIndex("accounts_provider_provider_account_id_key").on(table.provider, table.providerAccountId),
])

export const mediaDetails = pgTable("media_details", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  mediaId: integer("media_id").notNull(),
  mediaType: mediaTypeEnum("media_type").notNull(),
  score: numeric({ precision: 65, scale: 30 }),
  en: jsonb().notNull().$type<MediaDetailsInfoType>(),
  ru: jsonb().notNull().$type<MediaDetailsInfoType>(),
  createdAt: timestamp("created_at", { precision: 3, mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, mode: "date", withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}, table => [
  uniqueIndex("media_details_media_id_media_type_key").on(table.mediaId, table.mediaType),
])

export const mediaLists = pgTable("media_lists", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  humanFriendlyId: text("human_friendly_id").notNull().unique(),
  userId: uuid("user_id").notNull().references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
  title: text(),
  isSystem: boolean("is_system").default(false).notNull(),
  createdAt: timestamp("created_at", { precision: 3, mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, mode: "date", withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
  description: text(),
  accessLevel: mediaListAccessLevelEnum("access_level").default("PRIVATE").notNull(),
})

export const mediaItems = pgTable("media_items", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  mediaId: integer("media_id").notNull(),
  mediaType: mediaTypeEnum("media_type").notNull(),
  createdAt: timestamp("created_at", { precision: 3, mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, mode: "date", withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
  mediaListId: uuid("media_list_id").notNull().references(() => mediaLists.id, { onUpdate: "cascade", onDelete: "cascade" }),
  mediaDetailsId: uuid("media_details_id").references(() => mediaDetails.id, { onUpdate: "cascade", onDelete: "set null" }),
}, table => [
  uniqueIndex("media_items_media_id_media_type_media_list_id_key").on(
    table.mediaId,
    table.mediaType,
    table.mediaListId,
  ),
])
export const trackingData = pgTable("tracking_data", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  currentStatus: statusNameEnum("current_status").default("NOT_VIEWED").notNull(),
  note: text().default("").notNull(),
  score: integer(),
  sitesToView: jsonb("sites_to_view").default([]).notNull().$type<MediaItemSiteToViewType[]>(),
  tvProgress: jsonb("tv_progress").notNull().$type<MediaItemTvProgressType>(),
  createdAt: timestamp("created_at", { precision: 3, mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, mode: "date", withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
  mediaItemId: uuid("media_item_id").notNull().unique().references(() => mediaItems.id, { onUpdate: "cascade", onDelete: "cascade" }),
})

export const mediaListLikes = pgTable("media_list_likes", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  mediaListId: uuid("media_list_id").notNull().references(() => mediaLists.id, { onUpdate: "cascade", onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
  createdAt: timestamp("created_at", { precision: 3, mode: "date", withTimezone: true }).defaultNow().notNull(),
}, table => [
  uniqueIndex("media_list_likes_media_list_id_user_id_key").on(
    table.mediaListId,
    table.userId,
  ),
])

export const mediaListViews = pgTable("media_list_views", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  mediaListId: uuid("media_list_id").notNull().references(() => mediaLists.id, { onUpdate: "cascade", onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
  createdAt: timestamp("created_at", { precision: 3, mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, mode: "date", withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}, table => [
  uniqueIndex("media_list_views_media_list_id_user_id_key").on(
    table.mediaListId,
    table.userId,
  ),
])

export const userFollows = pgTable("user_follows", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  followerId: uuid("follower_id").notNull().references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
  followingId: uuid("following_id").notNull().references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
  createdAt: timestamp("created_at", { precision: 3, mode: "date", withTimezone: true }).defaultNow().notNull(),
}, table => [
  uniqueIndex("user_follows_follower_id_following_id_key").on(
    table.followerId,
    table.followingId,
  ),
])

export const mediaRatings = pgTable("media_ratings", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull().references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
  mediaId: integer("media_id").notNull(),
  mediaType: mediaTypeEnum("media_type").notNull(),
  rating: integer().notNull(),
  createdAt: timestamp("created_at", { precision: 3, mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, mode: "date", withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
  mediaDetailsId: uuid("media_details_id").references(() => mediaDetails.id, { onUpdate: "cascade", onDelete: "set null" }),
}, table => [
  uniqueIndex("media_ratings_media_id_media_type_user_id_key").on(
    table.mediaId,
    table.mediaType,
    table.userId,
  ),
])

export const releaseSubscriptions = pgTable("release_subscriptions", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  mediaDetailsId: uuid("media_details_id").references(() => mediaDetails.id, { onUpdate: "cascade", onDelete: "set null" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
  completedAt: timestamp("completed_at", { precision: 3, mode: "date", withTimezone: true }),
  createdAt: timestamp("created_at", { precision: 3, mode: "date", withTimezone: true }).defaultNow().notNull(),
  lastReleasedAt: timestamp("last_released_at", { precision: 3, mode: "date", withTimezone: true }),
  mediaId: integer("media_id").notNull(),
  mediaType: mediaTypeEnum("media_type").notNull(),
})

export const notifications = pgTable("notifications", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
  type: notificationTypeEnum().notNull(),
  meta: jsonb().notNull().$type<Omit<NotificationMetaType, "type">>(),
  readAt: timestamp("read_at", { precision: 3, mode: "date", withTimezone: true }),
  createdAt: timestamp("created_at", { precision: 3, mode: "date", withTimezone: true }).defaultNow().notNull(),
}, table => [
  index("notifications_meta_idx")
    .using("hash", table.meta),
])

export const mediaReviews = pgTable("media_reviews", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull().references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
  mediaId: integer("media_id").notNull(),
  mediaType: mediaTypeEnum("media_type").notNull(),
  mediaDetailsId: uuid("media_details_id").references(() => mediaDetails.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  title: text().notNull(),
  content: text().notNull(),
  isSpoiler: boolean("is_spoiler").default(false).notNull(),
  status: mediaReviewStatusEnum("status").default("DRAFT").notNull(),
  publishedAt: timestamp("published_at", { precision: 3, mode: "date", withTimezone: true }),
  removeReason: mediaReviewRemoveReasonEnum("remove_reason"),
  removedAt: timestamp("removed_at", { precision: 3, mode: "date", withTimezone: true }),
  createdAt: timestamp("created_at", { precision: 3, mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", {
    precision: 3,
    mode: "date",
    withTimezone: true,
  }).defaultNow().notNull().$onUpdate(() => new Date()),
}, table => [
  uniqueIndex(
    "media_reviews_media_id_media_type_user_id_key",
  ).on(table.mediaId, table.mediaType, table.userId),
])

export const mediaReviewLikes = pgTable("media_review_likes", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull().references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
  mediaId: integer("media_id").notNull(),
  mediaType: mediaTypeEnum("media_type").notNull(),
  mediaDetailsId: uuid("media_details_id").references(() => mediaDetails.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  mediaReviewId: uuid("media_review_id").notNull().references(() => mediaReviews.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at", { precision: 3, mode: "date", withTimezone: true }).defaultNow().notNull(),
}, table => [
  uniqueIndex("media_review_likes_media_review_id_user_id_key").on(
    table.mediaReviewId,
    table.userId,
  ),
])

export const mediaReviewDislikes = pgTable("media_review_dislikes", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull().references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
  mediaId: integer("media_id").notNull(),
  mediaType: mediaTypeEnum("media_type").notNull(),
  mediaDetailsId: uuid("media_details_id").references(() => mediaDetails.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  mediaReviewId: uuid("media_review_id").notNull().references(() => mediaReviews.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at", { precision: 3, mode: "date", withTimezone: true }).defaultNow().notNull(),
}, table => [
  uniqueIndex("media_review_dislikes_media_review_id_user_id_key").on(
    table.mediaReviewId,
    table.userId,
  ),
])
