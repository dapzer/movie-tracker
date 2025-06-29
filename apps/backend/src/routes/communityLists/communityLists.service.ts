import {
  CommunityListsRepositoryInterface,
  CommunityListsRepositorySymbol,
} from "@/repositories/communityLists/CommunityListsRepositoryInterface"
import { PaginationDto } from "@/shared/dto/pagination.dto"
import { Inject, Injectable } from "@nestjs/common"

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

  async getListByTitle(args: { title: string, currentUserId?: string } & PaginationDto) {
    return this.communityListsRepository.getByTitle({
      title: args.title,
      currentUserId: args.currentUserId,
    })
  }

  async getWeeklyTopLists(args: { currentUserId?: string } & PaginationDto) {
    return this.communityListsRepository.getWeakTop({
      limit: args.limit,
      offset: args.offset,
      fromDate: this.getCurrentWeekMondayDate(),
      currentUserId: args.currentUserId,
    })
  }

  async getAllTimeTopLists(args: { currentUserId?: string } & PaginationDto) {
    return this.communityListsRepository.getAllTimeTop({
      limit: args.limit,
      offset: args.offset,
      currentUserId: args.currentUserId,
    })
  }

  async getNewestLists(args: { currentUserId?: string } & PaginationDto) {
    return this.communityListsRepository.getNewest({
      limit: args.limit,
      offset: args.offset,
      currentUserId: args.currentUserId,
    })
  }
}
