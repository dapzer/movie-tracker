import { BanReasonValues, UserBanCreateBodyType } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { zDateTimeString } from "@/shared/dto/zod.utils"

const createUserBanSchema = z.object({
  userId: z.uuid().meta({ format: "uuid", example: "c1a9b6e2-3f4d-4a7c-9d2e-123456789abc" }),
  reason: z.enum(BanReasonValues).meta({
    enum: BanReasonValues,
    example: "SPAM",
  }),
  comment: z.string().optional().meta({ example: "Repeated unsolicited promotional messages." }),
  expiresAt: zDateTimeString.optional().meta({
    format: "date-time",
    example: "2026-08-01T12:00:00.000Z",
  }),
})

export class CreateUserBanDto extends createZodDto(createUserBanSchema) implements Omit<UserBanCreateBodyType, "issuedBy"> {}
