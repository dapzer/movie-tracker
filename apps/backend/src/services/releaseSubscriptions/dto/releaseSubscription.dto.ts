import { MediaTypeEnum, ReleaseSubscriptionsResponseType, ReleaseSubscriptionType, ReleaseSubscriptionWithDetailsType } from "@movie-tracker/types"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { MediaDetailsDto } from "@/services/mediaDetails/dto/mediaDetails.dto"

export class ReleaseSubscriptionDto implements ReleaseSubscriptionType {
  @ApiProperty({ type: String, format: "uuid" })
  id: string

  @ApiProperty({ type: Number, example: 550 })
  mediaId: number

  @ApiProperty({ enum: MediaTypeEnum })
  mediaType: MediaTypeEnum

  @ApiProperty({ type: String, format: "uuid" })
  mediaDetailsId: string

  @ApiProperty({ type: String, format: "uuid" })
  userId: string

  @ApiPropertyOptional({ type: String, format: "date-time", nullable: true })
  lastReleasedAt: Date | null

  @ApiPropertyOptional({ type: String, format: "date-time", nullable: true })
  completedAt: Date | null

  @ApiProperty({ type: String, format: "date-time" })
  createdAt: Date
}

export class ReleaseSubscriptionWithDetailsDto implements ReleaseSubscriptionWithDetailsType {
  @ApiProperty({ type: String, format: "uuid" })
  id: string

  @ApiProperty({ type: Number, example: 550 })
  mediaId: number

  @ApiProperty({ enum: MediaTypeEnum })
  mediaType: MediaTypeEnum

  @ApiProperty({ type: String, format: "uuid" })
  mediaDetailsId: string

  @ApiProperty({ type: String, format: "uuid" })
  userId: string

  @ApiPropertyOptional({ type: String, format: "date-time", nullable: true })
  lastReleasedAt: Date | null

  @ApiPropertyOptional({ type: String, format: "date-time", nullable: true })
  completedAt: Date | null

  @ApiProperty({ type: String, format: "date-time" })
  createdAt: Date

  @ApiProperty({ type: MediaDetailsDto })
  mediaDetails: MediaDetailsDto
}

export class ReleaseSubscriptionsResponseDto implements ReleaseSubscriptionsResponseType {
  @ApiProperty({ type: [ReleaseSubscriptionWithDetailsDto] })
  items: ReleaseSubscriptionWithDetailsDto[]

  @ApiProperty({ type: Number, example: 10 })
  totalCount: number

  @ApiProperty({ type: Number, example: 25 })
  totalSubscriptionsCount: number
}
