-- CreateTable
CREATE TABLE "media_ratings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "media_id" INTEGER NOT NULL,
    "media_type" "MediaTypeEnum" NOT NULL,
    "rating" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "media_ratings_media_id_media_type_user_id_key" ON "media_ratings"("media_id", "media_type", "user_id");

-- AddForeignKey
ALTER TABLE "media_ratings" ADD CONSTRAINT "media_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
