import { IsUUID } from "class-validator"

export class GetMediaRatingsByUserIdQueryDto {
  @IsUUID()
  userId: string
}
