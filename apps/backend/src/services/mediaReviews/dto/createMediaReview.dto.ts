import { MediaReviewCreateBodyType, MediaReviewStatus, MediaTypeEnum } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const createMediaReviewStatusValues = [MediaReviewStatus.DRAFT, MediaReviewStatus.PENDING] as const

const createMediaReviewSchema = z.object({
  mediaId: z.number().meta({ example: 550 }),
  mediaType: z.enum(MediaTypeEnum).meta({ enum: MediaTypeEnum, example: MediaTypeEnum.MOVIE }),
  title: z.string().meta({ example: "A fresh and stylish action film" }),
  // TODO: add validation for content length using constants from packages
  content: z.string().meta({ example: "Great pacing and soundtrack, but the third act feels rushed." }),
  status: z.enum(createMediaReviewStatusValues).meta({
    enum: createMediaReviewStatusValues,
    example: MediaReviewStatus.DRAFT,
  }),
  isSpoiler: z.boolean().meta({ example: false }),
})

export class CreateMediaReviewDto extends createZodDto(createMediaReviewSchema) implements Omit<MediaReviewCreateBodyType, "mediaDetailsId"> {}

export type CreateMediaReviewType = z.infer<typeof createMediaReviewSchema>
