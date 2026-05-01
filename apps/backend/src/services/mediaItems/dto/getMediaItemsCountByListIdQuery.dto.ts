import { MediaItemsCountByStatusQueries } from "@movie-tracker/types"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class GetMediaItemsCountByListIdQueryDto implements MediaItemsCountByStatusQueries {
  @ApiPropertyOptional({ type: String, example: "naruto" })
  @IsString()
  @IsOptional()
  search?: string
}
