import { MediaListAccessLevelEnum, MediaListType } from "@movie-tracker/types"
import { IsBoolean, IsDateString, IsEnum, IsString, IsUUID } from "class-validator"

export class MediaListDto implements MediaListType {
  @IsUUID()
  id: string

  @IsString()
  humanFriendlyId: string

  @IsUUID()
  userId: string

  @IsBoolean()
  isSystem: boolean

  @IsEnum(MediaListAccessLevelEnum)
  accessLevel: MediaListAccessLevelEnum

  @IsString()
  title: string

  @IsDateString()
  createdAt: Date

  @IsDateString()
  updatedAt: Date
}
