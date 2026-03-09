import { Type } from "class-transformer"
import { ArrayNotEmpty, IsArray, ValidateNested } from "class-validator"
import { CreateMediaItemDto } from "@/services/mediaItem/dto/createMediaItem.dto"

export class BulkCreateMediaItemDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateMediaItemDto)
  items: CreateMediaItemDto[]
}
