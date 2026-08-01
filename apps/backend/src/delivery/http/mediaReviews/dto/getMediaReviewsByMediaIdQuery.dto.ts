import { MEDIA_REVIEW_SORT_FIELDS, SortOrderEnum } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { PaginationDto } from "@/shared/dto/pagination.dto"

const getMediaReviewsByMediaIdQuerySchema = PaginationDto.schema.extend({
  sortBy: z.enum(MEDIA_REVIEW_SORT_FIELDS).optional().default("createdAt").meta({
    enum: MEDIA_REVIEW_SORT_FIELDS,
    default: "createdAt",
    example: "createdAt",
  }),
  sortDirection: z.enum(SortOrderEnum).optional().default(SortOrderEnum.DESC).meta({
    enum: SortOrderEnum,
    default: SortOrderEnum.DESC,
    example: SortOrderEnum.DESC,
  }),
})

export class GetMediaReviewsByMediaIdQueryDto extends createZodDto(getMediaReviewsByMediaIdQuerySchema) {}
