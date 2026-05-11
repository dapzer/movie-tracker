import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { MediaItemTrackingDataDto } from "@/services/mediaItems/dto/mediaItem.dto"

export class TrackingDataResponseDto extends MediaItemTrackingDataDto {}

const trackingDataBulkResponseSchema = z.object({
  items: z.array(TrackingDataResponseDto.schema),
})

export class TrackingDataBulkResponseDto extends createZodDto(trackingDataBulkResponseSchema) {}
