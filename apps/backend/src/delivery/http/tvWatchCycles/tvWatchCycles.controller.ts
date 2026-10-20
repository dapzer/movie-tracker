import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common"
import {
  GetActiveTvWatchCycleByMediaItemIdDocs,
  GetTvWatchCyclesByMediaItemIdDocs,
  StartTvWatchCycleDocs,
  TvWatchCyclesControllerDocs,
} from "@/delivery/http/tvWatchCycles/tvWatchCycles.controller.docs"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { CreateTvWatchCycleDto } from "@/services/tvWatchCycles/dto/createTvWatchCycle.dto"
import { TvWatchCyclesService } from "@/services/tvWatchCycles/tvWatchCycles.service"
import { UserDto } from "@/services/users/dto/user.dto"
import { User } from "@/services/users/user.decorator"
import { UuidDto } from "@/shared/dto/uuid.dto"

@Controller("tv-watch-cycles")
@TvWatchCyclesControllerDocs()
export class TvWatchCyclesController {
  constructor(private readonly tvWatchCyclesService: TvWatchCyclesService) {}

  @Get("by-media-item-id/:id")
  @GetTvWatchCyclesByMediaItemIdDocs()
  @UseGuards(AuthGuard)
  async getByMediaItemId(@Param() params: UuidDto, @User() user: UserDto) {
    return this.tvWatchCyclesService.getByMediaItemId({
      mediaItemId: params.id,
      userId: user.id,
    })
  }

  @Get("by-media-item-id/:id/active")
  @GetActiveTvWatchCycleByMediaItemIdDocs()
  @UseGuards(AuthGuard)
  async getActiveByMediaItemId(@Param() params: UuidDto, @User() user: UserDto) {
    return this.tvWatchCyclesService.getActiveByMediaItemId({
      mediaItemId: params.id,
      userId: user.id,
    })
  }

  @Post()
  @StartTvWatchCycleDocs()
  @UseGuards(AuthGuard)
  async startNewCycle(@Body() body: CreateTvWatchCycleDto, @User() user: UserDto) {
    return this.tvWatchCyclesService.startNewCycle({
      mediaItemId: body.mediaItemId,
      userId: user.id,
    })
  }
}
