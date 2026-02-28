import { MediaRatingCreateBodyType, MediaTypeEnum } from "@movie-tracker/types"
import { IsEnum, IsNumber, Max, Min } from "class-validator"

export class CreateMediaRatingDto implements Omit<MediaRatingCreateBodyType, "mediaDetailsId"> {
  @IsNumber()
  mediaId: number

  @IsEnum(MediaTypeEnum)
  mediaType: MediaTypeEnum

  @IsNumber({})
  @Min(0)
  @Max(10)
  rating: number
}
