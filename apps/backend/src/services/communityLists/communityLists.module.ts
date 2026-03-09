import { Module } from "@nestjs/common"
import { CommunityListsRepositorySymbol } from "@/repositories/communityLists/CommunityListsRepositoryInterface"
import { DrizzleCommunityListsRepository } from "@/repositories/communityLists/DrizzleCommunityListsRepository"
import { CommunityListsService } from "@/services/communityLists/communityLists.service"

@Module({
  providers: [
    CommunityListsService,
    { provide: CommunityListsRepositorySymbol, useClass: DrizzleCommunityListsRepository },
  ],
  exports: [CommunityListsService],
})
export class CommunityListsServiceModule {}
