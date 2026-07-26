ALTER TABLE "media_reviews_moderation_logs" ADD COLUMN "review_title_snapshot" text;--> statement-breakpoint
ALTER TABLE "media_reviews_moderation_logs" ADD COLUMN "review_content_snapshot" text NOT NULL;--> statement-breakpoint
ALTER TABLE "media_reviews_moderation_logs" ADD COLUMN "review_is_spoiler_snapshot" boolean NOT NULL;