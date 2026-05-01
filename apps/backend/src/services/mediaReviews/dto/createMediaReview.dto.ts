import { MediaReviewCreateBodyType, MediaReviewStatus, MediaTypeEnum } from "@movie-tracker/types"
import { IsBoolean, IsEnum, IsIn, IsNumber, IsString } from "class-validator"

export class CreateMediaReviewDto implements Omit<MediaReviewCreateBodyType, "mediaDetailsId"> {
  @IsNumber()
  mediaId: number

  @IsEnum(MediaTypeEnum)
  mediaType: MediaTypeEnum

  @IsString()
  title: string

  // TODO: add validation for content length using constants from packages
  @IsString()
  content: string

  @IsIn([MediaReviewStatus.DRAFT, MediaReviewStatus.PENDING])
  status: MediaReviewStatus

  @IsBoolean()
  isSpoiler: boolean
}
