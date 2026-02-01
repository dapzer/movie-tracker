import KeyvRedis from "@keyv/redis"
import { ThrottlerStorageRedisService } from "@nest-lab/throttler-storage-redis"
import { CacheModule } from "@nestjs/cache-manager"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { APP_GUARD } from "@nestjs/core"
import { ScheduleModule } from "@nestjs/schedule"
import { ThrottlerModule } from "@nestjs/throttler"
import { createClient } from "@redis/client"
import { NodeRedisAdapter } from "redlock-universal"
import { ThrottlerBehindProxyGuard } from "@/guards/throttlerBehindProxy.guard"
import { AnalyticsModule } from "@/routes/analytics/analytics.module"
import { AuthModule } from "@/routes/auth/auth.module"
import { CommunityListsModule } from "@/routes/communityLists/communityLists.module"
import { MediaDetailsModule } from "@/routes/mediaDetails/mediaDetails.module"
import { MediaItemModule } from "@/routes/mediaItem/mediaItem.module"
import { MediaListModule } from "@/routes/mediaList/mediaList.module"
import { MediaListViewModule } from "@/routes/mediaListView/mediaListView.module"
import { MediaRatingModule } from "@/routes/mediaRating/mediaRating.module"
import { OpenGraphImageModule } from "@/routes/openGraphImage/openGraphImage.module"
import { SitemapModule } from "@/routes/sitemap/sitemap.module"
import { TrackingDataModule } from "@/routes/trackingData/trackingData.module"
import { UserFollowModule } from "@/routes/userFollow/userFollow.module"
import { MailModule } from "@/services/mail/mail.module"
import { PrismaModule } from "@/services/prisma/prisma.module"
import { RedlockModule } from "@/services/redlock/redlock.module"
import { envSchema } from "@/shared/schemas/envSchema"
import { getMillisecondsFromHours } from "@/shared/utils/getMillisecondsFromHours"
import { getMillisecondsFromMins } from "@/shared/utils/getMillisecondsFromMins"
import { NotificationModule } from "./routes/notification/notification.module"
import { ProxyModule } from "./routes/proxy/proxy.module"
import { ReleaseSubscriptionModule } from "./routes/releaseSubscription/releaseSubscription.module"
import { UserModule } from "./routes/user/user.module"

@Module({
  imports: [
    ConfigModule.forRoot({ validate: env => envSchema.parse(env), isGlobal: true }),
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
          stores: [
            new KeyvRedis(configService.get("REDIS_URL")),
          ],
          namespace: "MT",
          ttl: getMillisecondsFromHours(4),
        }
      },
      inject: [ConfigService],
    }),
    RedlockModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const client = createClient({
          url: configService.get("REDIS_URL"),
        })
        await client.connect()

        return {
          nodes: [
            new NodeRedisAdapter(client),
          ],
          defaultTtl: getMillisecondsFromMins(1),
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
    MediaRatingModule,
    MediaListViewModule,
    CommunityListsModule,
    UserFollowModule,
    NotificationModule,
    ReleaseSubscriptionModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule {}
