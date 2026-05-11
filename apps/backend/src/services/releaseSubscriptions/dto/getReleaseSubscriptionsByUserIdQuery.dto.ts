import { GetReleaseSubscriptionsByUserIdQueries, MediaTypeEnum, SortOrderEnum } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { PaginationDto } from "@/shared/dto/pagination.dto"
import { zBooleanQuery } from "@/shared/dto/zod.utils"

const sortByOptions: GetReleaseSubscriptionsByUserIdQueries["sortBy"][] = ["createdAt", "lastReleasedAt"]

const getReleaseSubscriptionsByUserIdQuerySchema = PaginationDto.schema.extend({
  search: z.string().optional(),
  completed: zBooleanQuery.optional(),
  mediaType: z.enum(MediaTypeEnum).optional().meta({ enum: MediaTypeEnum }),
  sortDirection: z.enum(SortOrderEnum).optional().meta({ enum: SortOrderEnum }),
  sortBy: z.enum(sortByOptions).optional().meta({ enum: sortByOptions }),
})

export class GetReleaseSubscriptionsByUserIdQueryDto extends createZodDto(getReleaseSubscriptionsByUserIdQuerySchema) {}

export type GetReleaseSubscriptionsByUserIdQueryType = z.infer<typeof getReleaseSubscriptionsByUserIdQuerySchema>
