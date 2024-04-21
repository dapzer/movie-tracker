import { Controller, Post } from '@nestjs/common';
import { MailService } from '@/services/mail/mail.service';
import { ConfirmEmail } from '@movie-tracker/email-templates';
import { render } from '@react-email/render';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('')
  async sendEmail() {
    return this.mailService.send({
      subject: 'Hello',
      to: 'danilavoronkov2002@gmail.com',
      text: render(
        ConfirmEmail({
          username: 'Danil',
          url: 'https://movie-tracker.app/dashboard',
        }),
        { plainText: true },
      ),
      html: render(
        ConfirmEmail({
          username: 'Danil',
          url: 'https://movie-tracker.app/dashboard',
        }),
      ),
    });
  }
}
