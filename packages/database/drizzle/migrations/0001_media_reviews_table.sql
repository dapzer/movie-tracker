CREATE TYPE "public"."MediaReviewRemoveReasonEnum" AS ENUM('OFF_TOPIC', 'SPAM', 'TOXICITY', 'LOW_EFFORT_JUNK', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."MediaReviewStatusEnum" AS ENUM('DRAFT', 'PENDING', 'PUBLISHED', 'REMOVED', 'DELETED');--> statement-breakpoint
CREATE TABLE "media_review_dislikes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"media_id" integer NOT NULL,
	"media_type" "MediaTypeEnum" NOT NULL,
	"media_details_id" uuid,
	"media_review_id" uuid NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_review_likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"media_id" integer NOT NULL,
	"media_type" "MediaTypeEnum" NOT NULL,
	"media_details_id" uuid,
	"media_review_id" uuid NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"media_id" integer NOT NULL,
	"media_type" "MediaTypeEnum" NOT NULL,
	"media_details_id" uuid,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"is_spoiler" boolean DEFAULT false NOT NULL,
	"status" "MediaReviewStatusEnum" DEFAULT 'DRAFT' NOT NULL,
	"published_at" timestamp (3) with time zone,
	"remove_reason" "MediaReviewRemoveReasonEnum",
	"removed_at" timestamp (3) with time zone,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "media_review_dislikes" ADD CONSTRAINT "media_review_dislikes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "media_review_dislikes" ADD CONSTRAINT "media_review_dislikes_media_details_id_media_details_id_fk" FOREIGN KEY ("media_details_id") REFERENCES "public"."media_details"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "media_review_dislikes" ADD CONSTRAINT "media_review_dislikes_media_review_id_media_reviews_id_fk" FOREIGN KEY ("media_review_id") REFERENCES "public"."media_reviews"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "media_review_likes" ADD CONSTRAINT "media_review_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "media_review_likes" ADD CONSTRAINT "media_review_likes_media_details_id_media_details_id_fk" FOREIGN KEY ("media_details_id") REFERENCES "public"."media_details"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "media_review_likes" ADD CONSTRAINT "media_review_likes_media_review_id_media_reviews_id_fk" FOREIGN KEY ("media_review_id") REFERENCES "public"."media_reviews"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "media_reviews" ADD CONSTRAINT "media_reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "media_reviews" ADD CONSTRAINT "media_reviews_media_details_id_media_details_id_fk" FOREIGN KEY ("media_details_id") REFERENCES "public"."media_details"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "media_review_dislikes_media_review_id_user_id_key" ON "media_review_dislikes" USING btree ("media_review_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "media_review_likes_media_review_id_user_id_key" ON "media_review_likes" USING btree ("media_review_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "media_reviews_media_id_media_type_user_id_key" ON "media_reviews" USING btree ("media_id","media_type","user_id");