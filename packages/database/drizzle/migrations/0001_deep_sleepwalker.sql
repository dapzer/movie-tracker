CREATE TYPE "LanguagesEnum" AS ENUM ('ru', 'en');

ALTER TABLE "users" ADD COLUMN "language" "LanguagesEnum" DEFAULT 'ru' NOT NULL;