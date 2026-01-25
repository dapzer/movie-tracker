import { GetReleaseSubscriptionsByUserIdQueries, MediaTypeEnum, SortOrderEnum } from "@movie-tracker/types"
import { Transform } from "class-transformer"
import { IsBoolean, IsEnum, IsIn, IsOptional, IsString } from "class-validator"
import { PaginationDto } from "@/shared/dto/pagination.dto"

const sortByOptions: GetReleaseSubscriptionsByUserIdQueries["sortBy"][] = ["createdAt", "lastReleasedAt"]

export class GetReleaseSubscriptionsByUserIdQueryDto extends PaginationDto implements GetReleaseSubscriptionsByUserIdQueries {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === "true")
      return true
    if (value === "false")
      return false
    return value
  })
  completed?: boolean

  @IsOptional()
  @IsEnum(MediaTypeEnum)
  mediaType?: MediaTypeEnum

  @IsOptional()
  @IsEnum(SortOrderEnum)
  sortDirection?: SortOrderEnum

  @IsOptional()
  @IsIn(sortByOptions)
  sortBy?: GetReleaseSubscriptionsByUserIdQueries["sortBy"]
}
