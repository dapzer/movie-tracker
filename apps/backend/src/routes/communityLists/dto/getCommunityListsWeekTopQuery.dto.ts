import { PaginationDto } from "@/shared/dto/pagination.dto"
import { GetCommunityListsWeekTopQuery, SortOrderEnum } from "@movie-tracker/types"
import { IsEnum, IsIn, IsOptional, IsString } from "class-validator"

const sortByOptions: GetCommunityListsWeekTopQuery["sortBy"][] = ["views", "createdAt", "updatedAt"]

export class GetNewToExploreDto extends PaginationDto implements GetCommunityListsWeekTopQuery {
  @IsOptional()
  @IsEnum(SortOrderEnum)
  sortDirection?: SortOrderEnum

  @IsOptional()
  @IsIn(sortByOptions)
  sortBy: GetCommunityListsWeekTopQuery["sortBy"]

  @IsOptional()
  @IsString()
  title?: string
}
