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
import { parseNumberArrayQuery, parseStringArrayQuery, releaseStatusOptions } from "./mediaItemsFiltersQuery.helpers"

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

  @ApiPropertyOptional({
    enum: MediaTypeEnum,
    isArray: true,
    example: ["movie", "tv"],
  })
  @IsOptional()
  @Transform(({ value }) => parseStringArrayQuery(value))
  @IsArray()
  @IsEnum(MediaTypeEnum, { each: true })
  mediaTypes?: MediaTypeEnum[]

  @ApiPropertyOptional({ type: Number, isArray: true, example: [0, 10] })
  @IsOptional()
  @Transform(({ value }) => parseNumberArrayQuery(value))
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @Max(10, { each: true })
  rating?: [number, number]

  @ApiPropertyOptional({ type: Number, isArray: true, example: [1990, 2024] })
  @IsOptional()
  @Transform(({ value }) => parseNumberArrayQuery(value))
  @IsNumberOrUndefinedArray()
  releaseYear?: [number | undefined, number | undefined]

  @ApiPropertyOptional({ type: Number, isArray: true, example: [12, 28] })
  @IsOptional()
  @Transform(({ value }) => parseNumberArrayQuery(value))
  @IsArray()
  @IsInt({ each: true })
  genres?: number[]

  @ApiPropertyOptional({ enum: releaseStatusOptions, isArray: true, example: ["released", "ended"] })
  @IsOptional()
  @Transform(({ value }) => parseStringArrayQuery(value)?.map(status => status.toLowerCase()))
  @IsArray()
  @IsIn(releaseStatusOptions, { each: true })
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
