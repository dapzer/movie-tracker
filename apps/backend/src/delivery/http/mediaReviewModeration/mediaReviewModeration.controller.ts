import { UserRoleEnum } from "@movie-tracker/types"
import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common"
import { Roles } from "@/decorators/roles.decorator"
import { RolesGuard } from "@/guards/roles.guard"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { ModerateMediaReviewDto } from "@/services/mediaReviewModeration/dto/moderateMediaReview.dto"
import { MediaReviewModerationService } from "@/services/mediaReviewModeration/mediaReviewModeration.service"
import { UserDto } from "@/services/users/dto/user.dto"
import { User } from "@/services/users/user.decorator"
import { UuidDto } from "@/shared/dto/uuid.dto"
import {
  GetModerationLogsDocs,
  MediaReviewModerationControllerDocs,
  ModerateMediaReviewDocs,
} from "./mediaReviewModeration.controller.docs"

@MediaReviewModerationControllerDocs()
@Controller("media-review-moderation")
@UseGuards(AuthGuard)
@Roles([UserRoleEnum.ADMIN])
@UseGuards(RolesGuard)
export class MediaReviewModerationController {
  constructor(private readonly mediaReviewModerationService: MediaReviewModerationService) {}

  @Get(":id")
  @GetModerationLogsDocs()
  async getModerationLogs(@Param() params: UuidDto) {
    return this.mediaReviewModerationService.getLogsByReviewId({
      mediaReviewId: params.id,
    })
  }

  @Post()
  @ModerateMediaReviewDocs()
  async create(
    @User() user: UserDto,
    @Body() body: ModerateMediaReviewDto,
  ) {
    return this.mediaReviewModerationService.moderate({
      body,
      currentUserId: user.id,
    })
  }
}
