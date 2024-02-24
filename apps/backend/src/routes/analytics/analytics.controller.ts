import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from '@/routes/analytics/analytics.service';
import { AuthGuard } from '@/routes/auth/guards/auth.guard';
import { Roles } from '@/decorators/roles.decorator';
import { UserRoleEnum } from '@movie-tracker/types';
import { RolesGuard } from '@/guards/roles.guard';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('records')
  @UseGuards(AuthGuard)
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  async getRecords() {
    return this.analyticsService.getRecords();
  }
}
