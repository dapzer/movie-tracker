-- DropForeignKey
ALTER TABLE "public"."release_subscriptions" DROP CONSTRAINT "release_subscriptions_media_details_id_fkey";

-- AlterTable
ALTER TABLE "media_ratings" ADD COLUMN     "media_details_id" TEXT;

UPDATE media_ratings
SET media_details_id = media_details.id
FROM media_details
WHERE media_ratings.media_type = media_details.media_type
  AND media_ratings.media_id = media_details.media_id;


-- AlterTable
ALTER TABLE "release_subscriptions" ALTER COLUMN "media_details_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "media_ratings" ADD CONSTRAINT "media_ratings_media_details_id_fkey" FOREIGN KEY ("media_details_id") REFERENCES "media_details"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "release_subscriptions" ADD CONSTRAINT "release_subscriptions_media_details_id_fkey" FOREIGN KEY ("media_details_id") REFERENCES "media_details"("id") ON DELETE SET NULL ON UPDATE CASCADE;
