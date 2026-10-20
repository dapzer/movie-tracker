import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common"
import {
  BulkCreateTvEpisodeWatchDocs,
  CreateTvEpisodeWatchDocs,
  DeleteTvEpisodeWatchDocs,
  GetTvEpisodeWatchesByCycleIdDocs,
  TvEpisodeWatchesControllerDocs,
} from "@/delivery/http/tvEpisodeWatches/tvEpisodeWatches.controller.docs"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import {
  BulkCreateTvEpisodeWatchDto,
  CreateTvEpisodeWatchDto,
} from "@/services/tvEpisodeWatches/dto/createTvEpisodeWatch.dto"
import { TvEpisodeWatchesService } from "@/services/tvEpisodeWatches/tvEpisodeWatches.service"
import { UserDto } from "@/services/users/dto/user.dto"
import { User } from "@/services/users/user.decorator"
import { UuidDto } from "@/shared/dto/uuid.dto"

@Controller("tv-episode-watches")
@TvEpisodeWatchesControllerDocs()
export class TvEpisodeWatchesController {
  constructor(private readonly tvEpisodeWatchesService: TvEpisodeWatchesService) {}

  @Get("by-watch-cycle-id/:id")
  @GetTvEpisodeWatchesByCycleIdDocs()
  @UseGuards(AuthGuard)
  async getByCycleId(@Param() params: UuidDto, @User() user: UserDto) {
    return this.tvEpisodeWatchesService.getByCycleId({
      watchCycleId: params.id,
      userId: user.id,
    })
  }

  @Post()
  @CreateTvEpisodeWatchDocs()
  @UseGuards(AuthGuard)
  async createTvEpisodeWatch(@Body() body: CreateTvEpisodeWatchDto, @User() user: UserDto) {
    return this.tvEpisodeWatchesService.create({
      userId: user.id,
      body,
    })
  }

  @Post("bulk")
  @BulkCreateTvEpisodeWatchDocs()
  @UseGuards(AuthGuard)
  async bulkCreateTvEpisodeWatch(@Body() body: BulkCreateTvEpisodeWatchDto, @User() user: UserDto) {
    return this.tvEpisodeWatchesService.createBulk({
      userId: user.id,
      body,
    })
  }

  @Delete(":id")
  @DeleteTvEpisodeWatchDocs()
  @UseGuards(AuthGuard)
  async deleteTvEpisodeWatch(@Param() params: UuidDto, @User() user: UserDto) {
    return this.tvEpisodeWatchesService.delete({
      id: params.id,
      userId: user.id,
    })
  }
}
