import { MediaDetailsUpdateProgressType } from "@movie-tracker/types"
import { ApiProperty } from "@nestjs/swagger"

export class MediaDetailsUpdateProgressResDto implements MediaDetailsUpdateProgressType {
  @ApiProperty({ type: Number, example: 120 })
  successfulUpdates: number

  @ApiProperty({ type: Number, example: 5 })
  failedUpdatesByApi: number

  @ApiProperty({ type: Number, example: 2 })
  failedUpdatesByDb: number
}
