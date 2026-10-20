import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { TrackingDataDto } from "@/services/trackingData/dto/trackingData.dto"

export class TrackingDataResponseDto extends TrackingDataDto {}

const trackingDataBulkResponseSchema = z.object({
  items: z.array(TrackingDataResponseDto.schema),
})

export class TrackingDataBulkResponseDto extends createZodDto(trackingDataBulkResponseSchema) {}
