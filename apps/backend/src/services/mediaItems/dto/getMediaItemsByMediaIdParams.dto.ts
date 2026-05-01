import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsNumber } from "class-validator"

export class GetMediaItemsByMediaIdParams {
  @ApiProperty({ type: Number })
  @Transform(({ value }) => {
    return Number(value)
  })
  @IsNumber()
  mediaId: number
}
