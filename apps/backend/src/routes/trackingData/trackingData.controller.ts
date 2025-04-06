import { UserDto } from "@/routes/auth/dto/user.dto"
import { AuthGuard } from "@/routes/auth/guards/auth.guard"
import { MediaItemTrackingDataDto } from "@/routes/trackingData/dto/updateTrackingData.dto"
import { TrackingDataService } from "@/routes/trackingData/trackingData.service"
import { User } from "@/routes/user/users.decorator"
import { UuidDto } from "@/shared/dto/uuid.dto"
import { Body, Controller, Param, Patch, UseGuards } from "@nestjs/common"

@Controller("tracking-data")
export class TrackingDataController {
  constructor(private readonly trackingDataService: TrackingDataService) {}

  @Patch(":id")
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
    )
  }
}
