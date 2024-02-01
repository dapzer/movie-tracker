import { IsUUID } from "class-validator";

export class MediaItemListIdDto {
  @IsUUID()
  mediaListId: string;
}
