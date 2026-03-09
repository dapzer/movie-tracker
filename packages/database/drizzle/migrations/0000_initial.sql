CREATE TYPE "public"."MediaListAccessLevelEnum" AS ENUM('PUBLIC', 'URL', 'PRIVATE');--> statement-breakpoint
CREATE TYPE "public"."MediaTypeEnum" AS ENUM('movie', 'tv');--> statement-breakpoint
CREATE TYPE "public"."NotificationTypeEnum" AS ENUM('MEDIA_LIST_LIKE', 'USER_FOLLOW', 'MEDIA_RELEASE', 'MEDIA_STATUS_UPDATE');--> statement-breakpoint
CREATE TYPE "public"."SignUpMethodEnum" AS ENUM('EMAIL', 'GOOGLE', 'GITHUB', 'VK', 'YANDEX');--> statement-breakpoint
CREATE TYPE "public"."StatusNameEnum" AS ENUM('VIEWED', 'WATCHING_NOW', 'NOT_VIEWED', 'WAIT_NEW_PART');--> statement-breakpoint
CREATE TYPE "public"."UserMediaRatingsAccessLevelEnum" AS ENUM('PUBLIC', 'PRIVATE');--> statement-breakpoint
CREATE TYPE "public"."UserRoleEnum" AS ENUM('ADMIN', 'USER');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"media_id" integer NOT NULL,
	"media_type" "MediaTypeEnum" NOT NULL,
	"score" numeric(65, 30),
	"en" jsonb NOT NULL,
	"ru" jsonb NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"media_id" integer NOT NULL,
	"media_type" "MediaTypeEnum" NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"media_list_id" uuid NOT NULL,
	"media_details_id" uuid
);
--> statement-breakpoint
CREATE TABLE "media_list_likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"media_list_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_list_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"media_list_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_lists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"human_friendly_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text,
	"is_system" boolean DEFAULT false NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"description" text,
	"access_level" "MediaListAccessLevelEnum" DEFAULT 'PRIVATE' NOT NULL,
	CONSTRAINT "media_lists_human_friendly_id_unique" UNIQUE("human_friendly_id")
);
--> statement-breakpoint
CREATE TABLE "media_ratings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"media_id" integer NOT NULL,
	"media_type" "MediaTypeEnum" NOT NULL,
	"rating" integer NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"media_details_id" uuid
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"type" "NotificationTypeEnum" NOT NULL,
	"meta" jsonb NOT NULL,
	"read_at" timestamp (3) with time zone,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "release_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"media_details_id" uuid,
	"user_id" uuid NOT NULL,
	"completed_at" timestamp (3) with time zone,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"last_released_at" timestamp (3) with time zone,
	"media_id" integer NOT NULL,
	"media_type" "MediaTypeEnum" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"sid" text NOT NULL,
	"data" text NOT NULL,
	"expiresAt" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_sid_unique" UNIQUE("sid")
);
--> statement-breakpoint
CREATE TABLE "tracking_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"current_status" "StatusNameEnum" DEFAULT 'NOT_VIEWED' NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"score" integer,
	"sites_to_view" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tv_progress" jsonb NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"media_item_id" uuid NOT NULL,
	CONSTRAINT "tracking_data_media_item_id_unique" UNIQUE("media_item_id")
);
--> statement-breakpoint
CREATE TABLE "user_follows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"follower_id" uuid NOT NULL,
	"following_id" uuid NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text,
	"image" text,
	"roles" "UserRoleEnum"[] DEFAULT '{"USER"}' NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"is_email_verified" boolean DEFAULT false NOT NULL,
	"password" text,
	"sign_up_method" "SignUpMethodEnum" NOT NULL,
	"media_ratings_access_level" "UserMediaRatingsAccessLevelEnum" DEFAULT 'PUBLIC' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "media_items" ADD CONSTRAINT "media_items_media_list_id_media_lists_id_fk" FOREIGN KEY ("media_list_id") REFERENCES "public"."media_lists"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "media_items" ADD CONSTRAINT "media_items_media_details_id_media_details_id_fk" FOREIGN KEY ("media_details_id") REFERENCES "public"."media_details"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "media_list_likes" ADD CONSTRAINT "media_list_likes_media_list_id_media_lists_id_fk" FOREIGN KEY ("media_list_id") REFERENCES "public"."media_lists"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "media_list_likes" ADD CONSTRAINT "media_list_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "media_list_views" ADD CONSTRAINT "media_list_views_media_list_id_media_lists_id_fk" FOREIGN KEY ("media_list_id") REFERENCES "public"."media_lists"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "media_list_views" ADD CONSTRAINT "media_list_views_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "media_lists" ADD CONSTRAINT "media_lists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "media_ratings" ADD CONSTRAINT "media_ratings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "media_ratings" ADD CONSTRAINT "media_ratings_media_details_id_media_details_id_fk" FOREIGN KEY ("media_details_id") REFERENCES "public"."media_details"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "release_subscriptions" ADD CONSTRAINT "release_subscriptions_media_details_id_media_details_id_fk" FOREIGN KEY ("media_details_id") REFERENCES "public"."media_details"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "release_subscriptions" ADD CONSTRAINT "release_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tracking_data" ADD CONSTRAINT "tracking_data_media_item_id_media_items_id_fk" FOREIGN KEY ("media_item_id") REFERENCES "public"."media_items"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_follower_id_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_following_id_users_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts" USING btree ("provider","provider_account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "media_details_media_id_media_type_key" ON "media_details" USING btree ("media_id","media_type");--> statement-breakpoint
CREATE UNIQUE INDEX "media_items_media_id_media_type_media_list_id_key" ON "media_items" USING btree ("media_id","media_type","media_list_id");--> statement-breakpoint
CREATE UNIQUE INDEX "media_list_likes_media_list_id_user_id_key" ON "media_list_likes" USING btree ("media_list_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "media_list_views_media_list_id_user_id_key" ON "media_list_views" USING btree ("media_list_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "media_ratings_media_id_media_type_user_id_key" ON "media_ratings" USING btree ("media_id","media_type","user_id");--> statement-breakpoint
CREATE INDEX "notifications_meta_idx" ON "notifications" USING hash ("meta");--> statement-breakpoint
CREATE UNIQUE INDEX "user_follows_follower_id_following_id_key" ON "user_follows" USING btree ("follower_id","following_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_lower_unique" ON "users" USING btree (lower("email"));
