import { IsString } from "class-validator"

export class MediaItemListIdDto {
  @IsString()
  mediaListId: string
}
