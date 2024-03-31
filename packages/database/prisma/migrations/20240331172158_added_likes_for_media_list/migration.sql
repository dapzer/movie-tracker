-- AlterTable
ALTER TABLE "media_details" RENAME CONSTRAINT "mediaDetails_pkey" TO "media_details_pkey";

-- AlterTable
ALTER TABLE "media_items" RENAME CONSTRAINT "mediaItems_pkey" TO "media_items_pkey";

-- AlterTable
ALTER TABLE "media_lists" RENAME CONSTRAINT "mediaLists_pkey" TO "media_lists_pkey";

-- AlterTable
ALTER TABLE "tracking_data" RENAME CONSTRAINT "trackingData_pkey" TO "tracking_data_pkey";

-- CreateTable
CREATE TABLE "media_list_likes" (
    "id" TEXT NOT NULL,
    "media_list_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_list_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "media_list_likes_media_list_id_user_id_key" ON "media_list_likes"("media_list_id", "user_id");

-- RenameForeignKey
ALTER TABLE "media_items" RENAME CONSTRAINT "mediaItems_media_details_id_fkey" TO "media_items_media_details_id_fkey";

-- RenameForeignKey
ALTER TABLE "media_items" RENAME CONSTRAINT "mediaItems_media_list_id_fkey" TO "media_items_media_list_id_fkey";

-- RenameForeignKey
ALTER TABLE "media_lists" RENAME CONSTRAINT "mediaLists_user_id_fkey" TO "media_lists_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "tracking_data" RENAME CONSTRAINT "trackingData_media_item_id_fkey" TO "tracking_data_media_item_id_fkey";

-- AddForeignKey
ALTER TABLE "media_list_likes" ADD CONSTRAINT "media_list_likes_media_list_id_fkey" FOREIGN KEY ("media_list_id") REFERENCES "media_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_list_likes" ADD CONSTRAINT "media_list_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "mediaDetails_media_id_media_type_key" RENAME TO "media_details_media_id_media_type_key";

-- RenameIndex
ALTER INDEX "mediaItems_media_id_media_type_media_list_id_key" RENAME TO "media_items_media_id_media_type_media_list_id_key";

-- RenameIndex
ALTER INDEX "mediaLists_human_friendly_id_key" RENAME TO "media_lists_human_friendly_id_key";

-- RenameIndex
ALTER INDEX "trackingData_media_item_id_key" RENAME TO "tracking_data_media_item_id_key";
