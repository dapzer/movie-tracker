import { UserMediaRatingsAccessLevelEnum } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { zDateTimeString } from "@/shared/dto/zod.utils"

const userPublicSchema = z.object({
  id: z.string().uuid().meta({ format: "uuid", example: "a23d2b67-8a7e-4f70-9c8b-0a8f7a53c021" }),
  name: z.string().meta({ example: "Raphaël Ambrosius Costeau" }),
  image: z.string().optional().meta({ example: "https://avatars.githubusercontent.com/u/00000?v=4" }),
  mediaRatingsAccessLevel: z.enum(UserMediaRatingsAccessLevelEnum).optional().meta({ enum: UserMediaRatingsAccessLevelEnum }),
  createdAt: zDateTimeString.meta({ format: "date-time", example: "2026-04-28T12:34:56.000Z" }),
})

export class UserPublicDto extends createZodDto(userPublicSchema) {}
