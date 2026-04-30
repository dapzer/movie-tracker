import { MediaDetailsType, MediaRatingType, MediaTypeEnum } from "@movie-tracker/types"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { MediaDetailsResDto } from "@/services/mediaDetails/dto/mediaDetails.res.dto"
import { UserPublicDto } from "@/services/users/dto/userPublic.dto"

export class MediaRatingResDto implements MediaRatingType {
  @ApiProperty({ type: String, format: "uuid", example: "a23d2b67-8a7e-4f70-9c8b-0a8f7a53c021" })
  id: string

  @ApiProperty({ type: String, format: "uuid", example: "b10c5d0d-4ce2-4e31-8d1a-7d1a0b944b3a" })
  userId: string

  @ApiPropertyOptional({ type: UserPublicDto })
  user?: UserPublicDto

  @ApiProperty({ type: Number, example: 550 })
  mediaId: number

  @ApiProperty({ enum: MediaTypeEnum, example: MediaTypeEnum.MOVIE })
  mediaType: MediaTypeEnum

  @ApiProperty({ type: String, format: "uuid", example: "f6b49f5d-2c8a-4f3e-9e74-7a3f7d2d5a01" })
  mediaDetailsId: string

  @ApiPropertyOptional({ type: MediaDetailsResDto })
  mediaDetails?: MediaDetailsType

  @ApiProperty({ type: Number, minimum: 0, maximum: 10, example: 8 })
  rating: number

  @ApiProperty({ type: String, format: "date-time", example: "2026-04-28T12:34:56.000Z" })
  createdAt: Date

  @ApiProperty({ type: String, format: "date-time", example: "2026-04-28T12:34:56.000Z" })
  updatedAt: Date
}
