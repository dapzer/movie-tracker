import { MediaItemStatusNameEnum, MediaTypeEnum } from "@movie-tracker/types"
import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNumber, IsUUID } from "class-validator"

export class CreateMediaItemDto {
  @ApiProperty({ enum: MediaTypeEnum, example: MediaTypeEnum.MOVIE })
  @IsEnum(MediaTypeEnum)
  mediaType: MediaTypeEnum

  @ApiProperty({ type: Number, example: 550 })
  @IsNumber()
  mediaId: number

  @ApiProperty({ type: String, format: "uuid" })
  @IsUUID()
  mediaListId: string

  @ApiProperty({ enum: MediaItemStatusNameEnum, example: MediaItemStatusNameEnum.WATCHING_NOW })
  @IsEnum(MediaItemStatusNameEnum)
  currentStatus: MediaItemStatusNameEnum
}
