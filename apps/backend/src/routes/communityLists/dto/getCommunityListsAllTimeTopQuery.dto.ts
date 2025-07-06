import { PaginationDto } from "@/shared/dto/pagination.dto"
import { GetCommunityListsAllTimeTopQueries, SortOrderEnum } from "@movie-tracker/types"
import { IsEnum, IsIn, IsOptional, IsString } from "class-validator"

const sortByOptions: GetCommunityListsAllTimeTopQueries["sortBy"][] = ["likes", "createdAt", "updatedAt"]

export class GetCommunityListsAllTimeTopQueryDto extends PaginationDto implements GetCommunityListsAllTimeTopQueries {
  @IsOptional()
  @IsEnum(SortOrderEnum)
  sortDirection?: SortOrderEnum

  @IsOptional()
  @IsIn(sortByOptions)
  sortBy: GetCommunityListsAllTimeTopQueries["sortBy"]

  @IsOptional()
  @IsString()
  title?: string
}
