import { PaginationDto } from "@/shared/dto/pagination.dto"
import { GetCommunityListsAllTimeTopQuery, SortOrderEnum } from "@movie-tracker/types"
import { IsEnum, IsIn, IsOptional, IsString } from "class-validator"

const sortByOptions: GetCommunityListsAllTimeTopQuery["sortBy"][] = ["likes", "createdAt", "updatedAt"]

export class GetCommunityListsAllTimeTopQueryDto extends PaginationDto implements GetCommunityListsAllTimeTopQuery {
  @IsOptional()
  @IsEnum(SortOrderEnum)
  sortDirection?: SortOrderEnum

  @IsOptional()
  @IsIn(sortByOptions)
  sortBy: GetCommunityListsAllTimeTopQuery["sortBy"]

  @IsOptional()
  @IsString()
  title?: string
}
