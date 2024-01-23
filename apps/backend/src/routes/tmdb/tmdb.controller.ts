import { Controller, Get } from '@nestjs/common';
import { TmdbService } from '@/routes/tmdb/tmdb.service';

@Controller('tmdb')
export class TmdbController {
  constructor(private readonly tmdbService: TmdbService) {}

  @Get('dailyIdExport')
  getDailyTmdbIdExport() {
    return this.tmdbService.getDailyIdExport();
  }
}
