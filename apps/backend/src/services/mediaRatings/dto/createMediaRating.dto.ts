import { MediaRatingCreateBodyType, MediaTypeEnum } from "@movie-tracker/types"
import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNumber, Max, Min } from "class-validator"

export class CreateMediaRatingDto implements Omit<MediaRatingCreateBodyType, "mediaDetailsId"> {
  @ApiProperty({ type: Number, example: 550 })
  @IsNumber()
  mediaId: number

  @ApiProperty({ enum: MediaTypeEnum, example: MediaTypeEnum.MOVIE })
  @IsEnum(MediaTypeEnum)
  mediaType: MediaTypeEnum

  @ApiProperty({ type: Number, minimum: 0, maximum: 10, example: 8 })
  @IsNumber({})
  @Min(0)
  @Max(10)
  rating: number
}
