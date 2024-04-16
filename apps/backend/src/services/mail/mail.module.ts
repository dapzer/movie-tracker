import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import * as ses from '@aws-sdk/client-ses';
import { MailService } from '@/services/mail/mail.service';

@Global()
@Module({
  imports: [
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
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
