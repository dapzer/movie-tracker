import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { TrackingDataService } from '@/routes/trackingData/trackingData.service';
import { AuthGuard } from '@/routes/auth/guards/auth.guard';
import { User } from '@/routes/user/users.decorator';
import { UserDto } from '@/routes/auth/dto/user.dto';
import { UuidDto } from '@/shared/dto/uuid.dto';
import { MediaItemTrackingDataDto } from '@/routes/trackingData/dto/updateTrackingData.dto';

@Controller('trackingData')
export class TrackingDataController {
  constructor(private readonly trackingDataService: TrackingDataService) {}

  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateTrackingData(
    @Param() param: UuidDto,
    @User() user: UserDto,
    @Body() body: MediaItemTrackingDataDto,
  ) {
    return this.trackingDataService.updateTrackingData(
      param.id,
      user?.id,
      body,
    );
  }
}
