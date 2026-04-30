import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsString, IsUUID } from "class-validator"

export class MediaListLikeDto {
  @ApiProperty({ type: String, example: "056e7fa3-af3e-44b0-ae74-4f05f92e38d5" })
  @IsUUID()
  id: string

  @ApiProperty({ type: String, example: "056e7fa3-af3e-44b0-ae74-4f05f92e38d5" })
  @IsUUID()
  mediaListId: string

  @ApiProperty({ type: String, example: "056e7fa3-af3e-44b0-ae74-4f05f92e38d5" })
  @IsUUID()
  userId: string

  @ApiProperty({ type: String, format: "date-time", example: "2026-04-30T12:34:56.000Z" })
  @IsDateString()
  createdAt: Date

  @ApiProperty({
    type: String,
    example: "anime-watchlist-2026",
  })
  @IsString()
  mediaListHumanFriendlyId: string
}
