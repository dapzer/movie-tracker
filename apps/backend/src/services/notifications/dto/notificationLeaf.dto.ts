import {
  NotificationMediaListType,
  NotificationMediaReleaseEpisodeType,
} from "@movie-tracker/types"
import { ApiProperty } from "@nestjs/swagger"

export class NotificationMediaListDto implements NotificationMediaListType {
  @ApiProperty({ type: String, format: "uuid" })
  id: string

  @ApiProperty({ type: String, example: "My Favorite Movies" })
  title: string
}

export class NotificationMediaReleaseEpisodeDto implements NotificationMediaReleaseEpisodeType {
  @ApiProperty({ type: Number, example: 1 })
  seasonNumber: number

  @ApiProperty({ type: Number, example: 2 })
  episodeNumber: number
}
