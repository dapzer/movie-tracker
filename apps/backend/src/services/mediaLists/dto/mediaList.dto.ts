import { MediaListAccessLevelEnum, MediaListType } from "@movie-tracker/types"
import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDateString, IsEnum, IsString, IsUUID } from "class-validator"
import { PaginatedDto } from "@/shared/dto/paginated.dto"

export class MediaListDto implements MediaListType {
  @ApiProperty({ type: String, example: "056e7fa3-af3e-44b0-ae74-4f05f92e38d5" })
  @IsUUID()
  id: string

  @ApiProperty({ type: String, example: "anime-watchlist-2026" })
  @IsString()
  humanFriendlyId: string

  @ApiProperty({ type: String, example: "056e7fa3-af3e-44b0-ae74-4f05f92e38d5" })
  @IsUUID()
  userId: string

  @ApiProperty({ type: Boolean, example: false })
  @IsBoolean()
  isSystem: boolean

  @ApiProperty({ enum: MediaListAccessLevelEnum, example: MediaListAccessLevelEnum.PRIVATE })
  @IsEnum(MediaListAccessLevelEnum)
  accessLevel: MediaListAccessLevelEnum

  @ApiProperty({ type: String, example: "My Anime List" })
  @IsString()
  title: string

  @ApiProperty({ type: String, format: "date-time", example: "2026-04-30T12:34:56.000Z" })
  @IsDateString()
  createdAt: Date

  @ApiProperty({ type: String, format: "date-time", example: "2026-04-30T13:00:00.000Z" })
  @IsDateString()
  updatedAt: Date
}

export class MediaListsPaginatedDto extends PaginatedDto(MediaListDto) {}
