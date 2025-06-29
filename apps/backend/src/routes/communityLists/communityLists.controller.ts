import { UserDto } from "@/routes/auth/dto/user.dto"
import { GetMediaListsByTitleParamsDto } from "@/routes/communityLists/dto/getMediaListsByTitleParams.dto"
import { User } from "@/routes/user/users.decorator"
import { PaginationDto } from "@/shared/dto/pagination.dto"
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET } from "@movie-tracker/types"
import { Controller, Get, Query } from "@nestjs/common"
import { CommunityListsService } from "./communityLists.service"

@Controller("community-lists")
export class CommunityListsController {
  constructor(private readonly communityListsService: CommunityListsService) {
  }

  @Get("search")
  getListByTitle(@Query() query: GetMediaListsByTitleParamsDto, @User() user: UserDto) {
    return this.communityListsService.getListByTitle({
      title: query.title,
      currentUserId: user?.id,
      limit: query.limit ? Number(query.limit) : DEFAULT_PAGINATION_LIMIT,
      offset: query.offset ? Number(query.offset) : DEFAULT_PAGINATION_OFFSET,
    })
  }

  @Get("week-top")
  getWeekTop(@Query() query: PaginationDto, @User() user: UserDto) {
    return this.communityListsService.getWeeklyTopLists({
      limit: query.limit ? Number(query.limit) : DEFAULT_PAGINATION_LIMIT,
      offset: query.offset ? Number(query.offset) : DEFAULT_PAGINATION_OFFSET,
      currentUserId: user?.id,
    })
  }

  @Get("all-time-top")
  getAllTimeTop(@Query() query: PaginationDto, @User() user: UserDto) {
    return this.communityListsService.getAllTimeTopLists({
      limit: query.limit ? Number(query.limit) : DEFAULT_PAGINATION_LIMIT,
      offset: query.offset ? Number(query.offset) : DEFAULT_PAGINATION_OFFSET,
      currentUserId: user?.id,
    })
  }

  @Get("new-to-explore")
  getNewToExplore(@Query() query: PaginationDto, @User() user: UserDto) {
    return this.communityListsService.getNewestLists({
      limit: query.limit ? Number(query.limit) : DEFAULT_PAGINATION_LIMIT,
      offset: query.offset ? Number(query.offset) : DEFAULT_PAGINATION_OFFSET,
      currentUserId: user?.id,
    })
  }
}
