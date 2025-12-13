import { IsArray, IsUUID } from "class-validator"

export class MarkNotificationsAsReadDto {
  @IsArray()
  @IsUUID(undefined, { each: true })
  ids: Array<string>
}
