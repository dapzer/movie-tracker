import {
  MediaItemStatusNameEnum,
  MediaTypeEnum,
  SortOrderEnum,
} from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { PaginationDto } from "@/shared/dto/pagination.dto"
import { parseNumberArrayQuery, parseStringArrayQuery, releaseStatusOptions } from "./mediaItemsFiltersQuery.helpers"

const sortByOptions = ["createdAt", "updatedAt"] as const

const ratingTupleSchema = z
  .array(z.number().min(0).max(10))
  .length(2)
  .transform(values => [values[0], values[1]] as [number, number])

const releaseYearTupleSchema = z
  .array(z.number().optional())
  .length(2)
  .transform(values => [values[0], values[1]] as [number | undefined, number | undefined])

const getMediaItemsByListIdQuerySchema = PaginationDto.schema.extend({
  search: z.string().optional().meta({ example: "naruto" }),
  status: z
    .enum(MediaItemStatusNameEnum)
    .optional()
    .meta({ enum: MediaItemStatusNameEnum, example: MediaItemStatusNameEnum.WATCHING_NOW }),
  mediaTypes: z
    .preprocess(
      value => parseStringArrayQuery(value),
      z.array(z.enum(MediaTypeEnum)),
    )
    .optional()
    .meta({ enum: MediaTypeEnum, required: false, isArray: true, example: ["movie", "tv"] }),
  rating: z
    .preprocess(
      value => parseNumberArrayQuery(value)?.filter((item): item is number => item !== undefined),
      ratingTupleSchema,
    )
    .optional()
    .meta({ required: false, isArray: true, example: [0, 10] }),
  releaseYear: z
    .preprocess(
      value => parseNumberArrayQuery(value),
      releaseYearTupleSchema,
    )
    .optional()
    .meta({ required: false, isArray: true, example: [1990, 2024] }),
  genres: z
    .preprocess(
      value => parseNumberArrayQuery(value),
      z.array(z.number().int()),
    )
    .optional()
    .meta({ required: false, isArray: true, example: [12, 28] }),
  releaseStatuses: z
    .preprocess(
      value => parseStringArrayQuery(value)?.map(status => status.toLowerCase()),
      z.array(z.enum(releaseStatusOptions)),
    )
    .optional()
    .meta({ enum: releaseStatusOptions, required: false, isArray: true, example: ["released", "ended"] }),
  sortDirection: z.enum(SortOrderEnum).optional().meta({ enum: SortOrderEnum, example: SortOrderEnum.DESC }),
  sortBy: z.enum(sortByOptions).optional().meta({ enum: sortByOptions, example: "createdAt" }),
})

export class GetMediaItemsByListIdQueryDto extends createZodDto(getMediaItemsByListIdQuerySchema) {}

export type GetMediaItemsByListIdQueryType = z.infer<typeof getMediaItemsByListIdQuerySchema>
