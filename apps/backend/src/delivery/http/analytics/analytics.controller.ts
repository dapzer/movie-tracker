import { UserRoleEnum } from "@movie-tracker/types"
import { Controller, Get, UseGuards } from "@nestjs/common"
import { RolesWithDocs } from "@/decorators/rolesWithDocs.decorator"
import { RolesGuard } from "@/guards/roles.guard"
import { AnalyticsService } from "@/services/analytics/analytics.service"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { AnalyticsControllerDocs, GetRecordsDocs } from "./analytics.controller.docs"

@AnalyticsControllerDocs()
@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("records")
  @UseGuards(AuthGuard)
  @RolesWithDocs([UserRoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @GetRecordsDocs()
  async getRecords() {
    return this.analyticsService.getRecords()
  }
}
