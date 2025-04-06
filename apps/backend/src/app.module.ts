import { ThrottlerBehindProxyGuard } from "@/guards/throttlerBehindProxy.guard"
import { AnalyticsModule } from "@/routes/analytics/analytics.module"
import { AuthModule } from "@/routes/auth/auth.module"
import { MediaDetailsModule } from "@/routes/mediaDetails/mediaDetails.module"
import { MediaItemModule } from "@/routes/mediaItem/mediaItem.module"
import { MediaListModule } from "@/routes/mediaList/mediaList.module"
import { OpenGraphImageModule } from "@/routes/openGraphImage/openGraphImage.module"
import { SitemapModule } from "@/routes/sitemap/sitemap.module"
import { TrackingDataModule } from "@/routes/trackingData/trackingData.module"
import { MailModule } from "@/services/mail/mail.module"
import { PrismaModule } from "@/services/prisma/prisma.module"
import { getMillisecondsFromHours } from "@/shared/utils/getMillisecondsFromHours"
import { CacheModule } from "@nestjs/cache-manager"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { APP_GUARD } from "@nestjs/core"
import { ScheduleModule } from "@nestjs/schedule"
import { ThrottlerModule } from "@nestjs/throttler"
import { redisStore } from "cache-manager-redis-yet"
import { ThrottlerStorageRedisService } from "nestjs-throttler-storage-redis"
import { ProxyModule } from "./routes/proxy/proxy.module"
import { UserModule } from "./routes/user/user.module"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          throttlers: [],
          storage: new ThrottlerStorageRedisService(
            configService.get("REDIS_URL")!,
          ),
        }
      },
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          store: redisStore,
          ttl: getMillisecondsFromHours(4),
          url: configService.get("REDIS_URL")!,
        }
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
    MailModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule {}
