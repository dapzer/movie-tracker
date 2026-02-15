import { Type } from "class-transformer"
import { IsArray, IsUUID, ValidateNested } from "class-validator"
import { MediaItemTrackingDataDto } from "@/routes/trackingData/dto/updateTrackingData.dto"

export class BulkUpdateTrackingDataItemDto {
  @IsUUID()
  trackingDataId: string

  @ValidateNested()
  @Type(() => MediaItemTrackingDataDto)
  body: MediaItemTrackingDataDto
}

export class BulkUpdateTrackingDataDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkUpdateTrackingDataItemDto)
  items: BulkUpdateTrackingDataItemDto[]
}
