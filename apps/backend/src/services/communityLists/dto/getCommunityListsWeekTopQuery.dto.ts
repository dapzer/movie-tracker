import { GetCommunityListsWeekTopQueries, SortOrderEnum } from "@movie-tracker/types"
import { IsEnum, IsIn, IsOptional, IsString } from "class-validator"
import { PaginationDto } from "@/shared/dto/pagination.dto"

const sortByOptions: GetCommunityListsWeekTopQueries["sortBy"][] = ["views", "createdAt", "updatedAt"]

export class GetCommunityListsWeekTopQueryDto extends PaginationDto implements GetCommunityListsWeekTopQueries {
  @IsOptional()
  @IsEnum(SortOrderEnum)
  sortDirection?: SortOrderEnum

  @IsOptional()
  @IsIn(sortByOptions)
  sortBy: GetCommunityListsWeekTopQueries["sortBy"]

  @IsOptional()
  @IsString()
  title?: string
}
