import { Module } from "@nestjs/common"
import { OpenGraphImageService } from "@/services/openGraphImage/openGraphImage.service"

@Module({
  providers: [OpenGraphImageService],
  exports: [OpenGraphImageService],
})
export class OpenGraphImageServiceModule {}
