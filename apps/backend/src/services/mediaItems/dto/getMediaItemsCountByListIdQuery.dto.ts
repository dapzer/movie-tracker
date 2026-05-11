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
import { parseNumberArrayQuery, parseStringArrayQuery, releaseStatusOptions } from "./mediaItemsFiltersQuery.helpers"

export class GetMediaItemsCountByListIdQueryDto implements MediaItemsCountByStatusQueries {
  @ApiPropertyOptional({ type: String, example: "naruto" })
  @IsString()
  @IsOptional()
  search?: string

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
}
