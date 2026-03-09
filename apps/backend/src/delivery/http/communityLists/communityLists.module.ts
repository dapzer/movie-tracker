import { Module } from "@nestjs/common"
import { CommunityListsController } from "@/delivery/http/communityLists/communityLists.controller"
import { CommunityListsServiceModule } from "@/services/communityLists/communityLists.module"

@Module({
  imports: [CommunityListsServiceModule],
  controllers: [CommunityListsController],
})
export class CommunityListsHttpModule {}
