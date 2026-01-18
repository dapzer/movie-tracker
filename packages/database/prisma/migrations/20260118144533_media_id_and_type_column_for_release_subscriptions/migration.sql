/*
  Warnings:

  - Added the required column `media_id` to the `release_subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `media_type` to the `release_subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "release_subscriptions" ADD COLUMN     "media_id" INTEGER NOT NULL,
ADD COLUMN     "media_type" "MediaTypeEnum" NOT NULL;
