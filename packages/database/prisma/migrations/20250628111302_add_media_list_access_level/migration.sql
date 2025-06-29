-- CreateEnum
CREATE TYPE "MediaListAccessLevelEnum" AS ENUM ('PUBLIC', 'URL', 'PRIVATE');

-- AlterTable

ALTER TABLE "media_lists"
    ADD COLUMN "access_level" "MediaListAccessLevelEnum" NOT NULL DEFAULT 'PRIVATE';

-- UpdateData

UPDATE "media_lists"
SET "access_level" =
        CASE
            WHEN "is_public" = true THEN 'URL'::"MediaListAccessLevelEnum"
            ELSE 'PRIVATE'::"MediaListAccessLevelEnum"
            END;

-- AlterTable

ALTER TABLE "media_lists"
    DROP COLUMN "is_public";
