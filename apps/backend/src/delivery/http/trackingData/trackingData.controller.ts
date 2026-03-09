import { Body, Controller, Param, Patch, Post, UseGuards } from "@nestjs/common"
import { UserDto } from "@/services/auth/dto/user.dto"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { BulkUpdateTrackingDataDto } from "@/services/trackingData/dto/bulkUpdateTrackingData.dto"
import { MediaItemTrackingDataDto } from "@/services/trackingData/dto/updateTrackingData.dto"
import { TrackingDataService } from "@/services/trackingData/trackingData.service"
import { User } from "@/services/user/users.decorator"
import { UuidDto } from "@/shared/dto/uuid.dto"

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
    return this.trackingDataService.update(
      param.id,
      user?.id,
      body,
    )
  }

  @Post("bulk/update")
  @UseGuards(AuthGuard)
  async updateBulkTrackingData(
    @Body() body: BulkUpdateTrackingDataDto,
    @User() user: UserDto,
  ) {
    return this.trackingDataService.updateBulk(
      user?.id,
      body.items.map(item => ({ id: item.trackingDataId, data: item.body })),
    )
  }
}
