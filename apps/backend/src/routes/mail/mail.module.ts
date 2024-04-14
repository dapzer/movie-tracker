import { Module } from '@nestjs/common';
import { MailController } from '@/routes/mail/mail,.controller';

@Module({
  controllers: [MailController],
  providers: [],
  exports: [],
})
export class MailModule {}
