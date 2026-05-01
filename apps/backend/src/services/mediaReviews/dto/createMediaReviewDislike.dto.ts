import { MediaReviewDislikeCreateBodyType, MediaTypeEnum } from "@movie-tracker/types"
import { IsEnum, IsNumber, IsUUID } from "class-validator"

export class CreateMediaReviewDislikeDto implements Omit<MediaReviewDislikeCreateBodyType, "mediaDetailsId"> {
  @IsNumber()
  mediaId: number

  @IsEnum(MediaTypeEnum)
  mediaType: MediaTypeEnum

  @IsUUID()
  mediaReviewId: string
}
