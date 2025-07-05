import { PaginationDto } from "@/shared/dto/pagination.dto"
import { GetCommunityListsNewestQueries, SortOrderEnum } from "@movie-tracker/types"
import { IsEnum, IsIn, IsOptional, IsString } from "class-validator"

const sortByOptions: GetCommunityListsNewestQueries["sortBy"][] = ["createdAt", "updatedAt"]

export class GetCommunityListsNewestQueryDto extends PaginationDto implements GetCommunityListsNewestQueries {
  @IsOptional()
  @IsEnum(SortOrderEnum)
  sortDirection?: SortOrderEnum

  @IsOptional()
  @IsIn(sortByOptions)
  sortBy: GetCommunityListsNewestQueries["sortBy"]

  @IsOptional()
  @IsString()
  title?: string
}
