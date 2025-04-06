import { MediaItemSiteToViewType } from "@movie-tracker/types"
import { IsString } from "class-validator"

export class MediaItemSiteToViewDto implements MediaItemSiteToViewType {
  @IsString()
  url: string
}
