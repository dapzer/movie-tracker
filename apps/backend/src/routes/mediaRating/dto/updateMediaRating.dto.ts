import { MediaRatingUpdateBodyType } from "@movie-tracker/types"
import { IsNumber, Max, Min } from "class-validator"

export class UpdateMediaRatingDto implements MediaRatingUpdateBodyType {
  @IsNumber({})
  @Min(0)
  @Max(10)
  rating: number
}
