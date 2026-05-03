import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class MediaItemListIdDto {
  @ApiProperty({ type: String, example: "1b9e3d26-97d6-45ce-bc43-2e0296260759" })
  @IsString()
  mediaListId: string
}
