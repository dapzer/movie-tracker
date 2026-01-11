-- CreateTable
CREATE TABLE "release_subscriptions" (
    "id" TEXT NOT NULL,
    "media_details_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "release_subscriptions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "release_subscriptions" ADD CONSTRAINT "release_subscriptions_media_details_id_fkey" FOREIGN KEY ("media_details_id") REFERENCES "media_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "release_subscriptions" ADD CONSTRAINT "release_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
