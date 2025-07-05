import { UserDto } from "@/routes/auth/dto/user.dto"
import { GetCommunityListsAllTimeTopQueryDto } from "@/routes/communityLists/dto/getCommunityListsAllTimeTopQuery.dto"
import { GetCommunityListsByTitleQueryDto } from "@/routes/communityLists/dto/getCommunityListsByTitleQuery.dto"
import {
  GetCommunityListsNewToExploreQueryDto,
} from "@/routes/communityLists/dto/getCommunityListsNewToExploreQuery.dto"
import { GetNewToExploreDto } from "@/routes/communityLists/dto/getCommunityListsWeekTopQuery.dto"
import { GetCommunityListsWithMediaQueryDto } from "@/routes/communityLists/dto/getCommunityListsWithMediaQuery.dto"
import { User } from "@/routes/user/users.decorator"
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET } from "@movie-tracker/types"
import { Controller, Get, Query } from "@nestjs/common"
import { CommunityListsService } from "./communityLists.service"

@Controller("community-lists")
export class CommunityListsController {
  constructor(private readonly communityListsService: CommunityListsService) {
  }

  @Get("search")
  getListsByTitle(@Query() query: GetCommunityListsByTitleQueryDto, @User() user: UserDto) {
    return this.communityListsService.getListsByTitle({
      title: query.title,
      currentUserId: user?.id,
      limit: query.limit || DEFAULT_PAGINATION_LIMIT,
      offset: query.offset || DEFAULT_PAGINATION_OFFSET,
    })
  }

  @Get("week-top")
  getWeekTop(@Query() query: GetNewToExploreDto, @User() user: UserDto) {
    return this.communityListsService.getWeeklyTopLists({
      limit: query.limit || DEFAULT_PAGINATION_LIMIT,
      offset: query.offset || DEFAULT_PAGINATION_OFFSET,
      currentUserId: user?.id,
      sortBy: query.sortBy,
      sortDirection: query.sortDirection,
      title: query.title,
    })
  }

  @Get("all-time-top")
  getAllTimeTop(@Query() query: GetCommunityListsAllTimeTopQueryDto, @User() user: UserDto) {
    return this.communityListsService.getAllTimeTopLists({
      limit: query.limit || DEFAULT_PAGINATION_LIMIT,
      offset: query.offset || DEFAULT_PAGINATION_OFFSET,
      currentUserId: user?.id,
      sortBy: query.sortBy,
      sortDirection: query.sortDirection,
      title: query.title,
    })
  }

  @Get("new-to-explore")
  getNewToExplore(@Query() query: GetCommunityListsNewToExploreQueryDto, @User() user: UserDto) {
    return this.communityListsService.getNewestLists({
      limit: query.limit || DEFAULT_PAGINATION_LIMIT,
      offset: query.offset || DEFAULT_PAGINATION_OFFSET,
      currentUserId: user?.id,
      sortBy: query.sortBy,
      sortDirection: query.sortDirection,
      title: query.title,
    })
  }

  @Get("with-media")
  getListsWithMedia(
    @Query() query: GetCommunityListsWithMediaQueryDto,
    @User() user: UserDto,
  ) {
    return this.communityListsService.getListsWithMedia({
      mediaId: query.mediaId,
      limit: query.limit || DEFAULT_PAGINATION_LIMIT,
      offset: query.offset || DEFAULT_PAGINATION_OFFSET,
      currentUserId: user?.id,
    })
  }
}
