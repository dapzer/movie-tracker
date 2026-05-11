import { MediaReviewDislikeCreateBodyType, MediaTypeEnum } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const createMediaReviewDislikeSchema = z.object({
  mediaId: z.number().meta({ example: 550 }),
  mediaType: z.enum(MediaTypeEnum).meta({ enum: MediaTypeEnum, example: MediaTypeEnum.MOVIE }),
  mediaReviewId: z.uuid().meta({ format: "uuid", example: "e9a2f5b7-c6d3-4c0a-a35f-84c7f902ad59" }),
})

export class CreateMediaReviewDislikeDto extends createZodDto(createMediaReviewDislikeSchema) implements Omit<MediaReviewDislikeCreateBodyType, "mediaDetailsId"> {}

export type CreateMediaReviewDislikeType = z.infer<typeof createMediaReviewDislikeSchema>
