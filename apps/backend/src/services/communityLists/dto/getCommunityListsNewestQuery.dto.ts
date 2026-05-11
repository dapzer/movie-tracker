import {
  GetCommunityListsNewestQueries,
  SortOrderEnum,
} from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { PaginationDto } from "@/shared/dto/pagination.dto"

const sortByOptions: GetCommunityListsNewestQueries["sortBy"][] = ["createdAt", "updatedAt"]

const getCommunityListsNewestQuerySchema = PaginationDto.schema.extend({
  sortDirection: z.enum(SortOrderEnum).optional().meta({ enum: SortOrderEnum }),
  sortBy: z.enum(sortByOptions).optional().meta({ enum: sortByOptions }),
  title: z.string().optional(),
})

export class GetCommunityListsNewestQueryDto extends createZodDto(getCommunityListsNewestQuerySchema) {}
