import { OpenGraphImageController } from "@/routes/openGraphImage/openGraphImage.controller"
import { OpenGraphImageService } from "@/routes/openGraphImage/openGraphImage.service"
import { Module } from "@nestjs/common"

@Module({
  controllers: [OpenGraphImageController],
  providers: [OpenGraphImageService],
})
export class OpenGraphImageModule {}
