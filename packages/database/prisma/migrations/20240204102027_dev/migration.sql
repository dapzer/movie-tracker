-- CreateEnum
CREATE TYPE "StatusNameEnum" AS ENUM ('VIEWED', 'WATCHING_NOW', 'NOT_VIEWED', 'WAIT_NEW_PART');

-- CreateEnum
CREATE TYPE "MediaTypeEnum" AS ENUM ('movie', 'tv');

-- CreateEnum
CREATE TYPE "UserRoleEnum" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "image" TEXT,
    "roles" "UserRoleEnum"[] DEFAULT ARRAY['USER']::"UserRoleEnum"[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mediaLists" (
    "id" TEXT NOT NULL,
    "human_friendly_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT,
    "poster" TEXT,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mediaLists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mediaItems" (
    "id" TEXT NOT NULL,
    "media_id" INTEGER NOT NULL,
    "media_type" "MediaTypeEnum" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "media_list_id" TEXT NOT NULL,
    "media_details_id" TEXT,

    CONSTRAINT "mediaItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trackingData" (
    "id" TEXT NOT NULL,
    "current_status" "StatusNameEnum" NOT NULL DEFAULT 'NOT_VIEWED',
    "note" TEXT NOT NULL DEFAULT '',
    "score" INTEGER,
    "sites_to_view" JSONB NOT NULL DEFAULT '[]',
    "tv_progress" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "media_item_id" TEXT NOT NULL,

    CONSTRAINT "trackingData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mediaDetails" (
    "id" TEXT NOT NULL,
    "media_id" INTEGER NOT NULL,
    "media_type" "MediaTypeEnum" NOT NULL,
    "score" INTEGER,
    "en" JSONB NOT NULL,
    "ru" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mediaDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sid_key" ON "sessions"("sid");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "mediaLists_human_friendly_id_key" ON "mediaLists"("human_friendly_id");

-- CreateIndex
CREATE UNIQUE INDEX "mediaItems_media_id_media_type_media_list_id_key" ON "mediaItems"("media_id", "media_type", "media_list_id");

-- CreateIndex
CREATE UNIQUE INDEX "trackingData_media_item_id_key" ON "trackingData"("media_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "mediaDetails_media_id_media_type_key" ON "mediaDetails"("media_id", "media_type");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mediaLists" ADD CONSTRAINT "mediaLists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mediaItems" ADD CONSTRAINT "mediaItems_media_list_id_fkey" FOREIGN KEY ("media_list_id") REFERENCES "mediaLists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mediaItems" ADD CONSTRAINT "mediaItems_media_details_id_fkey" FOREIGN KEY ("media_details_id") REFERENCES "mediaDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trackingData" ADD CONSTRAINT "trackingData_media_item_id_fkey" FOREIGN KEY ("media_item_id") REFERENCES "mediaItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
