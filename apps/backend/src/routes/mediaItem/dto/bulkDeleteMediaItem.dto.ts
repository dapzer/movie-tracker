import { ArrayNotEmpty, IsArray, IsUUID } from "class-validator"

export class BulkDeleteMediaItemDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(undefined, { each: true })
  ids: string[]
}
