import { Module } from "@nestjs/common"
import { OpenGraphImageController } from "@/delivery/http/openGraphImage/openGraphImage.controller"
import { OpenGraphImageServiceModule } from "@/services/openGraphImage/openGraphImage.module"

@Module({
  imports: [OpenGraphImageServiceModule],
  controllers: [OpenGraphImageController],
})
export class OpenGraphImageHttpModule {}
