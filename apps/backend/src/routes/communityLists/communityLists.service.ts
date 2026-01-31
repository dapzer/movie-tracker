import { SortOrderEnum } from "@movie-tracker/types"
import { Inject, Injectable } from "@nestjs/common"
import {
  CommunityListsRepositoryInterface,
  CommunityListsRepositorySymbol,
} from "@/repositories/communityLists/CommunityListsRepositoryInterface"
import { GetCommunityListsAllTimeTopQueryDto } from "@/routes/communityLists/dto/getCommunityListsAllTimeTopQuery.dto"
import { GetCommunityListsNewestQueryDto } from "@/routes/communityLists/dto/getCommunityListsNewestQueryDto"
import { GetCommunityListsWeekTopQueryDto } from "@/routes/communityLists/dto/getCommunityListsWeekTopQuery.dto"
import { GetCommunityListsWithMediaQueryDto } from "@/routes/communityLists/dto/getCommunityListsWithMediaQuery.dto"
import { PaginationDto } from "@/shared/dto/pagination.dto"

@Injectable()
export class CommunityListsService {
  constructor(
    @Inject(CommunityListsRepositorySymbol) private readonly communityListsRepository: CommunityListsRepositoryInterface,
  ) {
  }

  private readonly getCurrentWeekMondayDate = (): Date => {
    const today = new Date()
    const dayOfWeek = today.getUTCDay()
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    const monday = new Date(Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate() - daysToMonday,
      0,
      0,
      0,
      0,
    ))
    return monday
  }

  async getListsSearch(args: { title: string, currentUserId?: string } & PaginationDto) {
    return this.communityListsRepository.getSearchResult({
      title: args.title,
      currentUserId: args.currentUserId,
      limit: args.limit,
      offset: args.offset,
    })
  }

  async getWeeklyTopLists(args: { currentUserId?: string } & GetCommunityListsWeekTopQueryDto) {
    return this.communityListsRepository.getWeakTop({
      limit: args.limit,
      offset: args.offset,
      fromDate: this.getCurrentWeekMondayDate(),
      currentUserId: args.currentUserId,
      sortBy: args.sortBy || "views",
      sortDirection: args.sortDirection || SortOrderEnum.DESC,
      title: args.title,
    })
  }

  async getAllTimeTopLists(args: { currentUserId?: string } & GetCommunityListsAllTimeTopQueryDto) {
    return this.communityListsRepository.getAllTimeTop({
      limit: args.limit,
      offset: args.offset,
      currentUserId: args.currentUserId,
      sortBy: args.sortBy || "likes",
      sortDirection: args.sortDirection || SortOrderEnum.DESC,
      title: args.title,
    })
  }

  async getNewestLists(args: { currentUserId?: string } & GetCommunityListsNewestQueryDto) {
    return this.communityListsRepository.getNewest({
      limit: args.limit,
      offset: args.offset,
      currentUserId: args.currentUserId,
      sortBy: args.sortBy || "createdAt",
      sortDirection: args.sortDirection || SortOrderEnum.DESC,
      title: args.title,
    })
  }

  async getListsWithMedia(args: { currentUserId?: string } & GetCommunityListsWithMediaQueryDto) {
    return this.communityListsRepository.getAllWithMedia({
      mediaId: args.mediaId,
      currentUserId: args.currentUserId,
      limit: args.limit,
      offset: args.offset,
      title: args.title,
    })
  }
}
