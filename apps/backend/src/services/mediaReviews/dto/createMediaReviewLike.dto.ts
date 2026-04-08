import { MediaReviewLikeCreateBodyType, MediaTypeEnum } from "@movie-tracker/types"
import { IsEnum, IsNumber, IsUUID } from "class-validator"

export class CreateMediaReviewLikeDto implements Omit<MediaReviewLikeCreateBodyType, "mediaDetailsId"> {
  @IsNumber()
  mediaId: number

  @IsEnum(MediaTypeEnum)
  mediaType: MediaTypeEnum

  @IsUUID()
  mediaReviewId: string
}
