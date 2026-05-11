import {
  GetCommunityListsWeekTopQueries,
  SortOrderEnum,
} from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { PaginationDto } from "@/shared/dto/pagination.dto"

const sortByOptions: GetCommunityListsWeekTopQueries["sortBy"][] = ["views", "createdAt", "updatedAt"]

const getCommunityListsWeekTopQuerySchema = PaginationDto.schema.extend({
  sortDirection: z.enum(SortOrderEnum).optional().meta({ enum: SortOrderEnum }),
  sortBy: z.enum(sortByOptions).optional().meta({ enum: sortByOptions }),
  title: z.string().optional().meta({ example: "my best lsit" }),
})

export class GetCommunityListsWeekTopQueryDto extends createZodDto(getCommunityListsWeekTopQuerySchema) {}
