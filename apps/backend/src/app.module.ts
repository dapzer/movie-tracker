import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MediaListModule } from '@/routes/mediaList/mediaList.module';
import { MediaItemModule } from '@/routes/mediaItem/mediaItem.module';
import { UserModule } from './routes/user/user.module';
import { ProxyModule } from './routes/proxy/proxy.module';
import { PrismaModule } from '@/services/prisma/prisma.module';
import { AuthModule } from '@/routes/auth/auth.module';
import { MediaDetailsModule } from '@/routes/mediaDetails/mediaDetails.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SitemapModule } from '@/routes/sitemap/sitemap.module';
import { AnalyticsModule } from '@/routes/analytics/analytics.module';
import { TrackingDataModule } from '@/routes/trackingData/trackingData.module';
import { OpenGraphImageModule } from '@/routes/openGraphImage/openGraphImage.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { getMillisecondsFromHours } from '@/shared/utils/getMillisecondsFromHours';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          store: await redisStore({
            ttl: getMillisecondsFromHours(4),
          }),
          url: configService.get('REDIS_URL')!,
        };
      },
      inject: [ConfigService],
    }),
    MediaListModule,
    MediaItemModule,
    UserModule,
    ProxyModule,
    PrismaModule,
    AuthModule,
    MediaDetailsModule,
    SitemapModule,
    AnalyticsModule,
    TrackingDataModule,
    OpenGraphImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
