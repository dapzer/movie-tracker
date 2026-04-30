import { Type } from "class-transformer"
import { IsArray, IsUUID, ValidateNested } from "class-validator"
import { UpdateTrackingDataDto } from "@/services/trackingData/dto/updateTrackingData.dto"

export class BulkUpdateTrackingDataItemDto {
  @IsUUID()
  trackingDataId: string

  @ValidateNested()
  @Type(() => UpdateTrackingDataDto)
  body: UpdateTrackingDataDto
}

export class BulkUpdateTrackingDataDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkUpdateTrackingDataItemDto)
  items: BulkUpdateTrackingDataItemDto[]
}
