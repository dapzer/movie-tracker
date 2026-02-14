import { IsArray, IsUUID } from "class-validator"

export class BulkDeleteMediaItemDto {
  @IsArray()
  @IsUUID(undefined, { each: true })
  ids: string[]
}
