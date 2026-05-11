import { UserMediaRatingsAccessLevelEnum } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const updateUserSchema = z.object({
  name: z.string().min(1).max(32).optional().meta({ example: "John Doe" }),
  image: z.url().optional().meta({ example: "https://cdn.example.com/avatar.jpg" }),
  mediaRatingsAccessLevel: z
    .enum(UserMediaRatingsAccessLevelEnum)
    .optional()
    .meta({ enum: UserMediaRatingsAccessLevelEnum, example: UserMediaRatingsAccessLevelEnum.PUBLIC }),
})

export class UpdateUserDto extends createZodDto(updateUserSchema) {}
