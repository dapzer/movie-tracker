import { MediaTypeEnum, SortOrderEnum } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { parseNumberArrayQuery, parseStringArrayQuery } from "@/services/mediaItems/dto/mediaItemsFiltersQuery.helpers"
import { PaginationDto } from "@/shared/dto/pagination.dto"

const ratingTupleSchema = z
  .array(z.number().min(0).max(10))
  .length(2)
  .transform<[number, number]>(values => [values[0], values[1]])
  .refine(([minimum, maximum]) => minimum <= maximum)

const getMediaRatingsByUserIdQuerySchema = PaginationDto.schema.extend({
  search: z.string().trim().optional().meta({ example: "blade runner" }),
  mediaTypes: z
    .preprocess(
      value => parseStringArrayQuery(value),
      z.array(z.enum(MediaTypeEnum)),
    )
    .optional()
    .meta({ enum: MediaTypeEnum, required: false, isArray: true, example: ["movie", "tv"] }),
  rating: z
    .preprocess(
      value => parseNumberArrayQuery(value),
      ratingTupleSchema,
    )
    .optional()
    .meta({ required: false, isArray: true, example: [0, 10] }),
  sortBy: z
    .enum(["createdAt", "updatedAt", "rating"])
    .optional()
    .meta({ enum: ["createdAt", "updatedAt", "rating"], required: false, example: "createdAt" }),
  sortDirection: z
    .enum(SortOrderEnum)
    .optional()
    .meta({ enum: SortOrderEnum, required: false, example: SortOrderEnum.DESC }),
})

export class GetMediaRatingsByUserIdQueryDto extends createZodDto(getMediaRatingsByUserIdQuerySchema) {}
