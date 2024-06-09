import { Controller, Get, UseGuards } from '@nestjs/common';
import { MediaDetailsService } from '@/routes/mediaDetails/mediaDetails.service';
import { AuthGuard } from '@/routes/auth/guards/auth.guard';
import { Roles } from '@/decorators/roles.decorator';
import { RolesGuard } from '@/guards/roles.guard';
import { UserRoleEnum } from '@movie-tracker/types';

@Controller('media-details')
export class MediaDetailsController {
  constructor(private readonly mediaDetailsService: MediaDetailsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  async createOrUpdateAllMediaDetails() {
    return this.mediaDetailsService.createOrUpdateAllMediaItemsDetails();
  }
}
