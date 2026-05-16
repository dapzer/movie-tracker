import { MediaReviewStatus } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { PaginationDto } from "@/shared/dto/pagination.dto"

const getMediaReviewsByUserIdQuerySchema = PaginationDto.schema.extend({
  status: z.enum(MediaReviewStatus).optional().default(MediaReviewStatus.PUBLISHED).meta({
    enum: MediaReviewStatus,
    default: MediaReviewStatus.PUBLISHED,
    example: MediaReviewStatus.PUBLISHED,
  }),
})

export class GetMediaReviewsByUserIdQueryDto extends createZodDto(getMediaReviewsByUserIdQuerySchema) {}
