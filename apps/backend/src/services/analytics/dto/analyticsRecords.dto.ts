import { AnalyticsRecords } from "@movie-tracker/types"
import { ApiProperty } from "@nestjs/swagger"

export class AnalyticsRecordsDto implements AnalyticsRecords {
  @ApiProperty({ example: 50000, description: "Number of media details records" })
  mediaDetails: number

  @ApiProperty({ example: 15000, description: "Number of media items" })
  mediaItems: number

  @ApiProperty({ example: 5000, description: "Number of users" })
  users: number

  @ApiProperty({ example: 10000, description: "Number of media lists" })
  mediaLists: number

  @ApiProperty({ example: 100000, description: "Number of media ratings" })
  mediaRatings: number
}
