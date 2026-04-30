import { ApiProperty } from "@nestjs/swagger"
import { MediaItemTrackingDataDto } from "@/services/mediaItems/dto/mediaItem.dto"

export class TrackingDataResponseDto extends MediaItemTrackingDataDto {}

export class TrackingDataBulkResponseDto {
  @ApiProperty({ type: [TrackingDataResponseDto] })
  items: TrackingDataResponseDto[]
}
