import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { UpdateTrackingDataDto } from "@/services/trackingData/dto/updateTrackingData.dto"

const bulkUpdateTrackingDataItemSchema = z.object({
  trackingDataId: z.string().uuid().meta({ format: "uuid", example: "c1a9b6e2-3f4d-4a7c-9d2e-123456789abc" }),
  body: UpdateTrackingDataDto.schema,
})

const bulkUpdateTrackingDataSchema = z.object({
  items: z.array(bulkUpdateTrackingDataItemSchema),
})

export class BulkUpdateTrackingDataItemDto extends createZodDto(bulkUpdateTrackingDataItemSchema) {}

export class BulkUpdateTrackingDataDto extends createZodDto(bulkUpdateTrackingDataSchema) {}
