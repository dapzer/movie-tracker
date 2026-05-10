import { MediaItemsCountByStatusQueries, MediaTypeEnum } from "@movie-tracker/types"
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
import { IsNumberOrUndefinedArray } from "@/shared/validations/IsNumberOrUndefinedArray"
import {
  parseNumberArrayQuery,
  parseRatingQuery,
  parseReleaseYearQuery,
  parseStringArrayQuery,
  releaseStatusOptions,
} from "./mediaItemsFiltersQuery.helpers"

export class GetMediaItemsCountByListIdQueryDto implements MediaItemsCountByStatusQueries {
  @ApiPropertyOptional({ type: String, example: "naruto" })
  @IsString()
  @IsOptional()
  search?: string

  @ApiPropertyOptional({ type: String, example: "movie,tv" })
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
}
