import { MediaItemsCountByStatusQueries } from "@movie-tracker/types"
import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class GetMediaItemsCountByListIdQueryDto implements MediaItemsCountByStatusQueries {
  @ApiProperty({ type: String, example: "naruto" })
  @IsString()
  @IsOptional()
  search?: string
}
