import { MediaListType } from "@movie-tracker/types"
import { IsBoolean, IsDateString, IsString, IsUUID } from "class-validator"

export class MediaListDto implements MediaListType {
  @IsUUID()
  id: string

  @IsString()
  humanFriendlyId: string

  @IsUUID()
  userId: string

  @IsBoolean()
  isSystem: boolean

  @IsBoolean()
  isPublic: boolean

  @IsString()
  title: string

  @IsDateString()
  createdAt: Date

  @IsDateString()
  updatedAt: Date
}
