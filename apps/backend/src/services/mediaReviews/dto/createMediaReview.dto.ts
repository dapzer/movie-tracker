import { MediaReviewCreateBodyType, MediaTypeEnum } from "@movie-tracker/types"
import { IsBoolean, IsEnum, IsNumber, IsString } from "class-validator"

export class CreateMediaReviewDto implements Omit<MediaReviewCreateBodyType, "mediaDetailsId"> {
  @IsNumber()
  mediaId: number

  @IsEnum(MediaTypeEnum)
  mediaType: MediaTypeEnum

  @IsString()
  title: string

  @IsString()
  content: string

  @IsBoolean()
  isSpoiler: boolean
}
