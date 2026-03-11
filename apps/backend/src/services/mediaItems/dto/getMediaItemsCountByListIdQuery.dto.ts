import { MediaItemsCountByStatusQueries } from "@movie-tracker/types"
import { IsOptional, IsString } from "class-validator"

export class GetMediaItemsCountByListIdQueryDto implements MediaItemsCountByStatusQueries {
  @IsString()
  @IsOptional()
  search?: string
}
