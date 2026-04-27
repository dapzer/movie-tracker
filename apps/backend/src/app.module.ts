import KeyvRedis from "@keyv/redis"
import { ThrottlerStorageRedisService } from "@nest-lab/throttler-storage-redis"
import { CacheModule } from "@nestjs/cache-manager"
import { Module, RequestMethod } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { APP_GUARD } from "@nestjs/core"
import { ScheduleModule } from "@nestjs/schedule"
import { ThrottlerModule } from "@nestjs/throttler"
import { createClient } from "@redis/client"
import { LoggerModule } from "nestjs-pino"
import { NodeRedisAdapter } from "redlock-universal"
import { HttpDeliveryModule } from "@/delivery/http/httpDelivery.module"
import { ThrottlerBehindProxyGuard } from "@/guards/throttlerBehindProxy.guard"
import { DrizzleModule } from "@/services/drizzle/drizzle.module"
import { MailModule } from "@/services/mail/mail.module"
import { PrismaModule } from "@/services/prisma/prisma.module"
import { RedlockModule } from "@/services/redlock/redlock.module"
import { config } from "@/shared/constants"
import { envSchema } from "@/shared/schemas/envSchema"
import { getMillisecondsFromHours } from "@/shared/utils/getMillisecondsFromHours"
import { getMillisecondsFromMins } from "@/shared/utils/getMillisecondsFromMins"

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
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: false,
        level: config.NODE_ENV !== "production" ? "debug" : "info",
        transport: config.NODE_ENV !== "production"
          ? { target: "pino-pretty" }
          : undefined,
        serializers: {
          req: () => undefined,
          res: () => undefined,
        },
      },
      forRoutes: [{ path: "/*path", method: RequestMethod.ALL }],
    }),
    PrismaModule,
    DrizzleModule,
    MailModule,
    HttpDeliveryModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule {}
