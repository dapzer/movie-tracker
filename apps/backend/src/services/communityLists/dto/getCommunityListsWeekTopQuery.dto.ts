import {
  GetCommunityListsWeekTopQueries,
  SortOrderEnum,
} from "@movie-tracker/types"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsEnum, IsIn, IsOptional, IsString } from "class-validator"
import { PaginationDto } from "@/shared/dto/pagination.dto"

const sortByOptions: GetCommunityListsWeekTopQueries["sortBy"][] = ["views", "createdAt", "updatedAt"]

export class GetCommunityListsWeekTopQueryDto extends PaginationDto implements GetCommunityListsWeekTopQueries {
  @ApiPropertyOptional({ enum: SortOrderEnum })
  @IsOptional()
  @IsEnum(SortOrderEnum)
  sortDirection?: SortOrderEnum

  @ApiPropertyOptional({ enum: sortByOptions })
  @IsOptional()
  @IsIn(sortByOptions)
  sortBy: GetCommunityListsWeekTopQueries["sortBy"]

  @ApiPropertyOptional({ type: String, example: "my best lsit" })
  @IsOptional()
  @IsString()
  title?: string
}
