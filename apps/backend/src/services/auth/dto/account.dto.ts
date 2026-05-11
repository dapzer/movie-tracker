import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { zDateTimeString } from "@/shared/dto/zod.utils"

const accountSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  access_token: z.string(),
  refresh_token: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  expires_at: z.number().int(),
  type: z.string(),
  createdAt: zDateTimeString,
  updatedAt: zDateTimeString,
})

export class AccountDto extends createZodDto(accountSchema) {}
