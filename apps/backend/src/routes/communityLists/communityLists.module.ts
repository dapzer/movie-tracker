import { CommunityListsRepositorySymbol } from "@/repositories/communityLists/CommunityListsRepositoryInterface"
import { PrismaCommunityListsRepository } from "@/repositories/communityLists/PrismaCommunityListsRepository"
import { Module } from "@nestjs/common"
import { CommunityListsController } from "./communityLists.controller"
import { CommunityListsService } from "./communityLists.service"

@Module({
  controllers: [CommunityListsController],
  providers: [CommunityListsService, {
    provide: CommunityListsRepositorySymbol,
    useClass: PrismaCommunityListsRepository,
  }],
})
export class CommunityListsModule {}
