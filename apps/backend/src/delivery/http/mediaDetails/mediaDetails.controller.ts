import { UserRoleEnum } from "@movie-tracker/types"
import { Controller, Get, UseGuards } from "@nestjs/common"
import { Roles } from "@/decorators/roles.decorator"
import { RolesGuard } from "@/guards/roles.guard"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { MediaDetailsService } from "@/services/mediaDetails/mediaDetails.service"
import { CreateOrUpdateAllMediaDetailsDocs, MediaDetailsControllerDocs } from "./mediaDetails.controller.docs"

@Controller("media-details")
@MediaDetailsControllerDocs()
export class MediaDetailsController {
  constructor(private readonly mediaDetailsService: MediaDetailsService) {}

  @Get()
  @CreateOrUpdateAllMediaDetailsDocs()
  @UseGuards(AuthGuard)
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  async createOrUpdateAllMediaDetails() {
    return this.mediaDetailsService.createOrUpdateAll()
  }
}
