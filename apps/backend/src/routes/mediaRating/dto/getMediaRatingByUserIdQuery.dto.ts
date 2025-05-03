import { MediaTypeEnum } from "@movie-tracker/types"
import { Transform } from "class-transformer"
import { IsEnum, IsNumber } from "class-validator"

export class GetMediaRatingByUserIdQueryDto {
  @Transform(({ value }) => {
    return Number(value)
  })
  @IsNumber()
  mediaId: number

  @IsEnum(MediaTypeEnum)
  mediaType: MediaTypeEnum
}
