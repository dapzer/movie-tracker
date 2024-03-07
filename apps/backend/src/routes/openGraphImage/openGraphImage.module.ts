import { Module } from '@nestjs/common';
import { OpenGraphImageService } from '@/routes/openGraphImage/openGraphImage.service';
import { OpenGraphImageController } from '@/routes/openGraphImage/openGraphImage.controller';

@Module({
  controllers: [OpenGraphImageController],
  providers: [OpenGraphImageService],
})
export class OpenGraphImageModule {}
