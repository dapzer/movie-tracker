import { Module } from '@nestjs/common';
import { TmdbService } from '@/routes/tmdb/tmdb.service';
import { TmdbController } from '@/routes/tmdb/tmdb.controller';

@Module({
  controllers: [TmdbController],
  providers: [TmdbService],
})
export class TmdbModule {}
