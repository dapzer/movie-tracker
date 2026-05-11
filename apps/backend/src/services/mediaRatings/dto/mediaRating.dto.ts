import { MediaTypeEnum } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { MediaDetailsDto } from "@/services/mediaDetails/dto/mediaDetails.dto"
import { UserPublicDto } from "@/services/users/dto/userPublic.dto"
import { zDateTimeString } from "@/shared/dto/zod.utils"

const mediaRatingSchema = z.object({
  id: z.string().uuid().meta({ format: "uuid", example: "a23d2b67-8a7e-4f70-9c8b-0a8f7a53c021" }),
  userId: z.string().uuid().meta({ format: "uuid", example: "b10c5d0d-4ce2-4e31-8d1a-7d1a0b944b3a" }),
  user: UserPublicDto.schema.optional(),
  mediaId: z.number().meta({ example: 550 }),
  mediaType: z.enum(MediaTypeEnum).meta({ enum: MediaTypeEnum, example: MediaTypeEnum.MOVIE }),
  mediaDetailsId: z
    .string()
    .uuid()
    .meta({ format: "uuid", example: "f6b49f5d-2c8a-4f3e-9e74-7a3f7d2d5a01" }),
  mediaDetails: MediaDetailsDto.schema.optional(),
  rating: z.number().min(0).max(10).meta({ minimum: 0, maximum: 10, example: 8 }),
  createdAt: zDateTimeString.meta({ format: "date-time", example: "2026-04-28T12:34:56.000Z" }),
  updatedAt: zDateTimeString.meta({ format: "date-time", example: "2026-04-28T12:34:56.000Z" }),
})

export class MediaRatingDto extends createZodDto(mediaRatingSchema) {}
