-- CreateEnum
CREATE TYPE "public"."UserMediaRatingsAccessLevelEnum" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "media_ratings_access_level" "public"."UserMediaRatingsAccessLevelEnum" NOT NULL DEFAULT 'PUBLIC';
