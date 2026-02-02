-- DropForeignKey
ALTER TABLE "public"."media_items" DROP CONSTRAINT "media_items_media_details_id_fkey";

-- AddForeignKey
ALTER TABLE "media_items" ADD CONSTRAINT "media_items_media_details_id_fkey" FOREIGN KEY ("media_details_id") REFERENCES "media_details"("id") ON DELETE SET NULL ON UPDATE CASCADE;
