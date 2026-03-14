import { Module } from "@nestjs/common"
import { OpenGraphImagesController } from "@/delivery/http/openGraphImages/openGraphImages.controller"
import { OpenGraphImagesServiceModule } from "@/services/openGraphImages/openGraphImages.module"

@Module({
  imports: [OpenGraphImagesServiceModule],
  controllers: [OpenGraphImagesController],
})
export class OpenGraphImagesModule {}
