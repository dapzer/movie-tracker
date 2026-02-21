import { MailerService } from "@nestjs-modules/mailer"
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { SendMailOptionsType } from "@/services/mail/dto/SendMailOptionsType"

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async send(options: SendMailOptionsType) {
    return this.mailerService.sendMail({
      subject: options.subject,
      to: options.to,
      from: {
        name: options?.from?.name ?? "Movie Tracker",
        address:
          options?.from?.address
          ?? this.configService.get("SUPPORT_EMAIL_ADDRESS"),
      },
      text: options?.text,
      html: options?.html,
    })
  }
}
