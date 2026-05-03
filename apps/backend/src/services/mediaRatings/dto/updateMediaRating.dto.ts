import { MediaRatingUpdateBodyType } from "@movie-tracker/types"
import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, Max, Min } from "class-validator"

export class UpdateMediaRatingDto implements MediaRatingUpdateBodyType {
  @ApiProperty({ type: Number, minimum: 0, maximum: 10, example: 9 })
  @IsNumber({})
  @Min(0)
  @Max(10)
  rating: number
}
