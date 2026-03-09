import { Module } from "@nestjs/common"
import { CommunityListsRepositorySymbol } from "@/repositories/communityLists/CommunityListsRepositoryInterface"
import { DrizzleCommunityListsRepository } from "@/repositories/communityLists/DrizzleCommunityListsRepository"
import { CommunityListsController } from "./communityLists.controller"
import { CommunityListsService } from "./communityLists.service"

@Module({
  controllers: [CommunityListsController],
  providers: [CommunityListsService, {
    provide: CommunityListsRepositorySymbol,
    useClass: DrizzleCommunityListsRepository,
  }],
})
export class CommunityListsModule {}
