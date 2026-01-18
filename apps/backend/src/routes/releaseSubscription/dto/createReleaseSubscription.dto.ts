import { CreateReleaseSubscriptionType, MediaTypeEnum } from "@movie-tracker/types"
import { IsEnum, IsNumber } from "class-validator"

export class CreateReleaseSubscriptionDto implements Pick<CreateReleaseSubscriptionType, "mediaId" | "mediaType"> {
  @IsNumber()
  mediaId: number

  @IsEnum(MediaTypeEnum)
  mediaType: MediaTypeEnum
}
