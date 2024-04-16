import { Controller, Post } from '@nestjs/common';
import { MailService } from '@/services/mail/mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('')
  async sendEmail() {
    return this.mailService.send({
      subject: 'Hello',
      to: 'danilavoronkov2002@gmail.com',
      text: 'Cock', // plaintext body
      html: '<b>welcome</b>', // HTML body content
    });
  }
}
