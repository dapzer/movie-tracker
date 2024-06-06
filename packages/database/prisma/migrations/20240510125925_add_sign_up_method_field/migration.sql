-- CreateEnum
CREATE TYPE "SignUpMethodEnum" AS ENUM ('EMAIL', 'GOOGLE', 'GITHUB', 'VK', 'YANDEX');

-- AlterTable
ALTER TABLE "users"
    ADD COLUMN "sign_up_method" "SignUpMethodEnum";

-- UpdateData
UPDATE users
SET sign_up_method    =
        CASE
            WHEN accounts.provider = 'google' THEN 'GOOGLE'::"SignUpMethodEnum"
            WHEN accounts.provider = 'github' THEN 'GITHUB'::"SignUpMethodEnum"
            WHEN accounts.provider = 'vk' THEN 'VK'::"SignUpMethodEnum"
            WHEN accounts.provider = 'yandex' THEN 'YANDEX'::"SignUpMethodEnum"
            ELSE 'EMAIL'::"SignUpMethodEnum"
            END,
    is_email_verified = CASE
                            WHEN accounts.provider = 'google' THEN true
                            WHEN accounts.provider = 'yandex' THEN true
                            ELSE false
        END
FROM accounts
WHERE users.id = accounts.user_id;

-- SetNotNull
ALTER TABLE "users"
    ALTER COLUMN "sign_up_method" SET NOT NULL;
