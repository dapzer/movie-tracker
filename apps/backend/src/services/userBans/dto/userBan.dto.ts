import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { UserPublicDto } from "@/services/users/dto/userPublic.dto"
import { zDateTimeString } from "@/shared/dto/zod.utils"

const userBanSchema = z.object({
  id: z.uuid().meta({ format: "uuid", example: "a23d2b67-8a7e-4f70-9c8b-0a8f7a53c021" }),
  userId: z.uuid().meta({ format: "uuid", example: "c1a9b6e2-3f4d-4a7c-9d2e-123456789abc" }),
  issuedBy: z.uuid().meta({ format: "uuid", example: "e9a2f5b7-c6d3-4c0a-a35f-84c7f902ad59" }),
  reason: z.enum(["SPAM", "TOXICITY", "MSFW", "FRAUD", "OTHER"]).meta({
    enum: ["SPAM", "TOXICITY", "MSFW", "FRAUD", "OTHER"],
    example: "SPAM",
  }),
  comment: z.string().nullable().optional(),
  createdAt: zDateTimeString.meta({ format: "date-time" }),
  revokedAt: zDateTimeString.nullable().optional().meta({ format: "date-time", nullable: true }),
  revokedBy: z.uuid().nullable().optional().meta({ format: "uuid", nullable: true }),
  expiresAt: zDateTimeString.nullable().optional().meta({ format: "date-time", nullable: true }),
  userProfile: UserPublicDto.schema,
  issuerUserProfile: UserPublicDto.schema,
  revokerUserProfile: UserPublicDto.schema.nullable().optional(),
})

const userBansPaginatedSchema = z.object({
  items: z.array(userBanSchema),
  totalCount: z.number().meta({ example: 25 }),
})

export class UserBanDto extends createZodDto(userBanSchema) {}
export class UserBansPaginatedDto extends createZodDto(userBansPaginatedSchema) {}
