import { UserDto } from "@/routes/auth/dto/user.dto"
import { GetMediaListsByTitleParamsDto } from "@/routes/communityLists/dto/getMediaListsByTitleParams.dto"
import { GetMediaListsWithMediaQueryDto } from "@/routes/communityLists/dto/getMediaListsWithMediaQuery.dto"
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
  getListsByTitle(@Query() query: GetMediaListsByTitleParamsDto, @User() user: UserDto) {
    return this.communityListsService.getListsByTitle({
      title: query.title,
      currentUserId: user?.id,
      limit: query.limit || DEFAULT_PAGINATION_LIMIT,
      offset: query.offset || DEFAULT_PAGINATION_OFFSET,
    })
  }

  @Get("week-top")
  getWeekTop(@Query() query: PaginationDto, @User() user: UserDto) {
    return this.communityListsService.getWeeklyTopLists({
      limit: query.limit || DEFAULT_PAGINATION_LIMIT,
      offset: query.offset || DEFAULT_PAGINATION_OFFSET,
      currentUserId: user?.id,
    })
  }

  @Get("all-time-top")
  getAllTimeTop(@Query() query: PaginationDto, @User() user: UserDto) {
    return this.communityListsService.getAllTimeTopLists({
      limit: query.limit || DEFAULT_PAGINATION_LIMIT,
      offset: query.offset || DEFAULT_PAGINATION_OFFSET,
      currentUserId: user?.id,
    })
  }

  @Get("new-to-explore")
  getNewToExplore(@Query() query: PaginationDto, @User() user: UserDto) {
    return this.communityListsService.getNewestLists({
      limit: query.limit || DEFAULT_PAGINATION_LIMIT,
      offset: query.offset || DEFAULT_PAGINATION_OFFSET,
      currentUserId: user?.id,
    })
  }

  @Get("with-media")
  getListsWithMedia(
    @Query() query: GetMediaListsWithMediaQueryDto,
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
