import { MailService } from "@/services/mail/mail.service"
import { MailerModule } from "@nestjs-modules/mailer"
import { Global, Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { createTransport } from "nodemailer"

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: createTransport({
          host: configService.get("SMTP_HOST"),
          port: configService.get("SMTP_PORT"),
          auth: {
            user: configService.get("SMTP_USER"),
            pass: configService.get("SMTP_KEY"),
          },
        }).transporter,
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {
}
