import { MediaReviewRemoveReason, MediaReviewStatus, MediaReviewUpdateBodyType } from "@movie-tracker/types"
import { IsBoolean, IsDate, IsEnum, IsOptional } from "class-validator"

export class UpdateMediaReviewDto implements Partial<MediaReviewUpdateBodyType> {
  @IsBoolean()
  @IsOptional()
  isSpoiler?: boolean

  @IsEnum(MediaReviewStatus)
  @IsOptional()
  status?: MediaReviewStatus

  @IsDate()
  @IsOptional()
  publishedAt?: Date

  @IsEnum(MediaReviewRemoveReason)
  @IsOptional()
  removeReason?: MediaReviewRemoveReason

  @IsDate()
  @IsOptional()
  removedAt?: Date
}
