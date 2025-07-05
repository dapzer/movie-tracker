import { PaginationDto } from "@/shared/dto/pagination.dto"
import { GetCommunityListsNewestQuery, SortOrderEnum } from "@movie-tracker/types"
import { IsEnum, IsIn, IsOptional, IsString } from "class-validator"

const sortByOptions: GetCommunityListsNewestQuery["sortBy"][] = ["createdAt", "updatedAt"]

export class GetCommunityListsNewToExploreQueryDto extends PaginationDto implements GetCommunityListsNewestQuery {
  @IsOptional()
  @IsEnum(SortOrderEnum)
  sortDirection?: SortOrderEnum

  @IsOptional()
  @IsIn(sortByOptions)
  sortBy: GetCommunityListsNewestQuery["sortBy"]

  @IsOptional()
  @IsString()
  title?: string
}
