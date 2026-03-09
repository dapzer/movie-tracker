import { Module } from "@nestjs/common"
import { MediaItemController } from "@/delivery/http/mediaItem/mediaItem.controller"
import { MediaItemServiceModule } from "@/services/mediaItem/mediaItem.module"

@Module({
  imports: [MediaItemServiceModule],
  controllers: [MediaItemController],
})
export class MediaItemHttpModule {}
