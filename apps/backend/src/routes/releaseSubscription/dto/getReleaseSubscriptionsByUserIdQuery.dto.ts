import { GetReleaseSubscriptionsByUserIdQueries, SortOrderEnum } from "@movie-tracker/types"
import { IsEnum, IsIn, IsOptional, IsString } from "class-validator"
import { PaginationDto } from "@/shared/dto/pagination.dto"

const sortByOptions: GetReleaseSubscriptionsByUserIdQueries["sortBy"][] = ["createdAt", "lastReleasedAt"]

export class GetReleaseSubscriptionsByUserIdQueryDto extends PaginationDto implements GetReleaseSubscriptionsByUserIdQueries {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsEnum(SortOrderEnum)
  sortDirection?: SortOrderEnum

  @IsOptional()
  @IsIn(sortByOptions)
  sortBy?: GetReleaseSubscriptionsByUserIdQueries["sortBy"]
}
