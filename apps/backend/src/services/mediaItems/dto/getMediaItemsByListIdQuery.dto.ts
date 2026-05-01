import {
  GetMediaItemsByListIdQueries,
  MediaItemStatusNameEnum,
  MediaTypeEnum,
  SortOrderEnum,
} from "@movie-tracker/types"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsEnum, IsIn, IsOptional, IsString } from "class-validator"
import { PaginationDto } from "@/shared/dto/pagination.dto"

const sortByOptions: NonNullable<GetMediaItemsByListIdQueries["sortBy"]>[] = ["createdAt", "updatedAt"]

export class GetMediaItemsByListIdQueryDto extends PaginationDto implements GetMediaItemsByListIdQueries {
  @ApiPropertyOptional({ type: String, example: "naruto" })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({ enum: MediaItemStatusNameEnum, example: MediaItemStatusNameEnum.WATCHING_NOW })
  @IsOptional()
  @IsEnum(MediaItemStatusNameEnum)
  status?: MediaItemStatusNameEnum

  @ApiPropertyOptional({ enum: MediaTypeEnum, example: MediaTypeEnum.MOVIE })
  @IsOptional()
  @IsEnum(MediaTypeEnum)
  mediaType?: MediaTypeEnum

  @ApiPropertyOptional({ enum: SortOrderEnum, example: SortOrderEnum.DESC })
  @IsOptional()
  @IsEnum(SortOrderEnum)
  sortDirection?: SortOrderEnum

  @ApiPropertyOptional({ enum: sortByOptions, example: "createdAt" })
  @IsOptional()
  @IsIn(sortByOptions)
  sortBy?: GetMediaItemsByListIdQueries["sortBy"]
}
