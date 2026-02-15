import { Transform } from "class-transformer"
import { IsNumber } from "class-validator"

export class GetMediaItemsByMediaIdParams {
  @Transform(({ value }) => {
    return Number(value)
  })
  @IsNumber()
  mediaId: number
}
