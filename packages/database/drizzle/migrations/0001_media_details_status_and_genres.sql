ALTER TABLE "media_details" ADD COLUMN "status" text;--> statement-breakpoint
ALTER TABLE "media_details" ADD COLUMN "genres" integer[] DEFAULT '{}' NOT NULL;
