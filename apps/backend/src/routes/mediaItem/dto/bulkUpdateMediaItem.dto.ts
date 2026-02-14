import { Type } from "class-transformer"
import { IsArray, IsUUID, ValidateNested } from "class-validator"
import { UpdateMediaItemDto } from "@/routes/mediaItem/dto/updateMediaItem.dto"

export class BulkUpdateMediaItemDto {
  @IsUUID()
  id: string

  @ValidateNested()
  @Type(() => UpdateMediaItemDto)
  data: UpdateMediaItemDto
}

export class BulkUpdateMediaItemsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkUpdateMediaItemDto)
  items: BulkUpdateMediaItemDto[]
}
