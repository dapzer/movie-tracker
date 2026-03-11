import { Module } from "@nestjs/common"
import { OpenGraphImagesService } from "@/services/openGraphImages/openGraphImages.service"

@Module({
  providers: [OpenGraphImagesService],
  exports: [OpenGraphImagesService],
})
export class OpenGraphImagesServiceModule {}
