CREATE TYPE "public"."DataImportSourceEnum" AS ENUM('letterboxd', 'trakt');--> statement-breakpoint
CREATE TYPE "public"."DataImportStatusEnum" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');--> statement-breakpoint
CREATE TABLE "data_imports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"source" "DataImportSourceEnum" NOT NULL,
	"status" "DataImportStatusEnum" DEFAULT 'PENDING' NOT NULL,
	"result" jsonb NOT NULL,
	"processed_at" timestamp (3) with time zone,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "data_imports" ADD CONSTRAINT "data_imports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;