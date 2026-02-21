import { UserRoleEnum } from "@movie-tracker/types"
import { Controller, Get, UseGuards } from "@nestjs/common"
import { Roles } from "@/decorators/roles.decorator"
import { RolesGuard } from "@/guards/roles.guard"
import { AuthGuard } from "@/routes/auth/guards/auth.guard"
import { MediaDetailsService } from "@/routes/mediaDetails/mediaDetails.service"

@Controller("media-details")
export class MediaDetailsController {
  constructor(private readonly mediaDetailsService: MediaDetailsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  async createOrUpdateAllMediaDetails() {
    return this.mediaDetailsService.createOrUpdateAll()
  }
}
