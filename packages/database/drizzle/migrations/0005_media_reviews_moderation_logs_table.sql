CREATE TABLE "media_reviews_moderation_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"media_review_id" uuid NOT NULL,
	"moderator_id" uuid,
	"action" "MediaReviewModerationActionEnum" NOT NULL,
	"reason" "MediaReviewModerationReasonEnum",
	"comment" text,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "media_reviews_moderation_logs_reason_required_if_rejected" CHECK (("media_reviews_moderation_logs"."action" NOT IN ('REJECTED', 'CHANGES_REQUESTED')) OR ("media_reviews_moderation_logs"."reason" IS NOT NULL))
);
--> statement-breakpoint
ALTER TABLE "media_reviews_moderation_logs" ADD CONSTRAINT "media_reviews_moderation_logs_media_review_id_media_reviews_id_fk" FOREIGN KEY ("media_review_id") REFERENCES "public"."media_reviews"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "media_reviews_moderation_logs" ADD CONSTRAINT "media_reviews_moderation_logs_moderator_id_users_id_fk" FOREIGN KEY ("moderator_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE cascade;