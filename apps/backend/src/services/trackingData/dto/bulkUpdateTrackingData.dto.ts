import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsArray, IsUUID, ValidateNested } from "class-validator"
import { UpdateTrackingDataDto } from "@/services/trackingData/dto/updateTrackingData.dto"

export class BulkUpdateTrackingDataItemDto {
  @ApiProperty({ type: String, format: "uuid", example: "c1a9b6e2-3f4d-4a7c-9d2e-123456789abc" })
  @IsUUID()
  trackingDataId: string

  @ApiProperty({ type: () => UpdateTrackingDataDto })
  @ValidateNested()
  @Type(() => UpdateTrackingDataDto)
  body: UpdateTrackingDataDto
}

export class BulkUpdateTrackingDataDto {
  @ApiProperty({ type: () => [BulkUpdateTrackingDataItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkUpdateTrackingDataItemDto)
  items: BulkUpdateTrackingDataItemDto[]
}
