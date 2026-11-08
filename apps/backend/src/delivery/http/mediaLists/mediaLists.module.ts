import { Module } from "@nestjs/common"
import { MediaListsController } from "@/delivery/http/mediaLists/mediaLists.controller"
import { ThrottlerBehindProxyGuard } from "@/guards/throttlerBehindProxy.guard"
import { MediaListsServiceModule } from "@/services/mediaLists/mediaLists.module"

@Module({
  imports: [MediaListsServiceModule],
  controllers: [MediaListsController],
  providers: [ThrottlerBehindProxyGuard],
})
export class MediaListsModule {}
