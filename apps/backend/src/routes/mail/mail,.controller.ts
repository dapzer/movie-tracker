import { Controller, Post } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailerService) {}

  @Post('')
  async sendEmail() {
    return this.mailService.sendMail({
      subject: 'Hello',
      to: 'danilavoronkov2002@gmail.com',
      text: 'Welcome',
    });
  }
}
