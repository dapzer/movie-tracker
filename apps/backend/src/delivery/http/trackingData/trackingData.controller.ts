import { Body, Controller, Param, Patch, Post, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { BulkUpdateTrackingDataDto } from "@/services/trackingData/dto/bulkUpdateTrackingData.dto"
import { UpdateTrackingDataDto } from "@/services/trackingData/dto/updateTrackingData.dto"
import { TrackingDataService } from "@/services/trackingData/trackingData.service"
import { UserDto } from "@/services/users/dto/user.dto"
import { User } from "@/services/users/user.decorator"
import { UuidDto } from "@/shared/dto/uuid.dto"

@Controller("tracking-data")
export class TrackingDataController {
  constructor(private readonly trackingDataService: TrackingDataService) {}

  @Patch(":id")
  @UseGuards(AuthGuard)
  async updateTrackingData(
    @Param() param: UuidDto,
    @User() user: UserDto,
    @Body() body: UpdateTrackingDataDto,
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
