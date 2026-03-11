import {
  GetMediaItemsByListIdQueries,
  MediaItemStatusNameEnum,
  MediaTypeEnum,
  SortOrderEnum,
} from "@movie-tracker/types"
import { IsEnum, IsIn, IsOptional, IsString } from "class-validator"
import { PaginationDto } from "@/shared/dto/pagination.dto"

const sortByOptions: NonNullable<GetMediaItemsByListIdQueries["sortBy"]>[] = ["createdAt", "updatedAt"]

export class GetMediaItemsByListIdQueryDto extends PaginationDto implements GetMediaItemsByListIdQueries {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsEnum(MediaItemStatusNameEnum)
  status?: MediaItemStatusNameEnum

  @IsOptional()
  @IsEnum(MediaTypeEnum)
  mediaType?: MediaTypeEnum

  @IsOptional()
  @IsEnum(SortOrderEnum)
  sortDirection?: SortOrderEnum

  @IsOptional()
  @IsIn(sortByOptions)
  sortBy?: GetMediaItemsByListIdQueries["sortBy"]
}
