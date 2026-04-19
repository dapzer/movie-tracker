import {
  MediaReviewModerationLogAction,
  MediaReviewModerationLogCreateBodyType,
  MediaReviewModerationLogReason,
} from "@movie-tracker/types"
import { IsEnum, IsOptional, IsString, IsUUID, ValidateIf } from "class-validator"

export class ModerateMediaReviewDto implements MediaReviewModerationLogCreateBodyType {
  @IsString()
  @IsUUID()
  mediaReviewId: string

  @IsEnum(MediaReviewModerationLogAction)
  action: MediaReviewModerationLogAction

  @IsEnum(MediaReviewModerationLogReason)
  @ValidateIf(o => [MediaReviewModerationLogAction.REJECTED, MediaReviewModerationLogAction.CHANGES_REQUESTED].includes(o.action))
  reason?: MediaReviewModerationLogReason

  @IsString()
  @IsOptional()
  comment?: string
}
