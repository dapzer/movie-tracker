import { UserMediaRatingsAccessLevelEnum, UserPublicType } from "@movie-tracker/types"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class UserPublicDto implements UserPublicType {
  @ApiProperty({ type: String, format: "uuid", example: "a23d2b67-8a7e-4f70-9c8b-0a8f7a53c021" })
  id: string

  @ApiProperty({ type: String, example: "Raphaël Ambrosius Costeau" })
  name: string

  @ApiPropertyOptional({ type: String, example: "https://avatars.githubusercontent.com/u/00000?v=4" })
  image?: string

  @ApiPropertyOptional({ enum: UserMediaRatingsAccessLevelEnum })
  mediaRatingsAccessLevel?: UserMediaRatingsAccessLevelEnum

  @ApiProperty({ type: String, format: "date-time", example: "2026-04-28T12:34:56.000Z" })
  createdAt: Date
}
