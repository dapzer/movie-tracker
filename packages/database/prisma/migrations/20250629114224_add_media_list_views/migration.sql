-- CreateTable
CREATE TABLE "media_list_views" (
    "id" TEXT NOT NULL,
    "media_list_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_list_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "media_list_views_media_list_id_user_id_key" ON "media_list_views"("media_list_id", "user_id");

-- AddForeignKey
ALTER TABLE "media_list_views" ADD CONSTRAINT "media_list_views_media_list_id_fkey" FOREIGN KEY ("media_list_id") REFERENCES "media_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_list_views" ADD CONSTRAINT "media_list_views_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
