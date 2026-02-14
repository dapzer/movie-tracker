import { Type } from "class-transformer"
import { IsArray, ValidateNested } from "class-validator"
import { CreateMediaItemDto } from "@/routes/mediaItem/dto/createMediaItem.dto"

export class BulkCreateMediaItemDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMediaItemDto)
  items: CreateMediaItemDto[]
}
