import {
  GetMediaItemsByListIdQueries,
  MediaItemStatusNameEnum,
  MediaTypeEnum,
  SortOrderEnum,
} from "@movie-tracker/types"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator"
import { PaginationDto } from "@/shared/dto/pagination.dto"
import { IsNumberOrUndefinedArray } from "@/shared/validations/IsNumberOrUndefinedArray"
import {
  parseNumberArrayQuery,
  parseRatingQuery,
  parseReleaseYearQuery,
  parseStringArrayQuery,
  releaseStatusOptions,
} from "./mediaItemsFiltersQuery.helpers"

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

  @ApiPropertyOptional({ enum: MediaTypeEnum, isArray: true, example: [MediaTypeEnum.MOVIE, MediaTypeEnum.TV] })
  @IsOptional()
  @IsArray()
  @IsEnum(MediaTypeEnum, { each: true })
  @Transform(({ value }) => parseStringArrayQuery(value))
  mediaTypes?: MediaTypeEnum[]

  @ApiPropertyOptional({ type: String, example: "0,10" })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @Max(10, { each: true })
  @Transform(({ value }) => parseRatingQuery(value))
  rating?: [number, number]

  @ApiPropertyOptional({ type: String, example: "1990,2024" })
  @IsOptional()
  @IsNumberOrUndefinedArray()
  @Transform(({ value }) => parseReleaseYearQuery(value))
  releaseYear?: [number | undefined, number | undefined]

  @ApiPropertyOptional({ type: String, example: "12,28" })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) => parseNumberArrayQuery(value))
  genres?: number[]

  @ApiPropertyOptional({ enum: releaseStatusOptions, isArray: true, example: ["released", "ended"] })
  @IsOptional()
  @IsArray()
  @IsIn(releaseStatusOptions, { each: true })
  @Transform(({ value }) => parseStringArrayQuery(value)?.map(status => status.toLowerCase()))
  releaseStatuses?: string[]

  @ApiPropertyOptional({ enum: SortOrderEnum, example: SortOrderEnum.DESC })
  @IsOptional()
  @IsEnum(SortOrderEnum)
  sortDirection?: SortOrderEnum

  @ApiPropertyOptional({ enum: sortByOptions, example: "createdAt" })
  @IsOptional()
  @IsIn(sortByOptions)
  sortBy?: GetMediaItemsByListIdQueries["sortBy"]
}
