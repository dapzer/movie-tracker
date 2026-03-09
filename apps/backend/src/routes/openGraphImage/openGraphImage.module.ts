import { Module } from "@nestjs/common"
import { OpenGraphImageController } from "@/routes/openGraphImage/openGraphImage.controller"
import { OpenGraphImageService } from "@/routes/openGraphImage/openGraphImage.service"

@Module({
  controllers: [OpenGraphImageController],
  providers: [OpenGraphImageService],
})
export class OpenGraphImageModule {}
