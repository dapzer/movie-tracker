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
import { MailModule } from '@/routes/mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import * as ses from '@aws-sdk/client-ses';
import { createTransport } from 'nodemailer';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: createTransport({
          SES: {
            ses: new ses.SESClient({
              region: configService.get('SES_REGION'),
              credentials: {
                accessKeyId: configService.get('SES_ACCESS_KEY_ID')!,
                secretAccessKey: configService.get('SES_SECRET_ACCESS_KEY')!,
              },
            }),
            aws: ses,
          },
        }).transporter,
        defaults: {
          from: `Movies Tracker Support <${configService.get('SUPPORT_EMAIL_ADDRESS')}>`,
        },
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          store: redisStore,
          ttl: getMillisecondsFromHours(4),
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
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
