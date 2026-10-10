import { TvWatchCycleType } from "@movie-tracker/types"
import { Inject, Injectable } from "@nestjs/common"
import {
  MediaItemRepositoryInterface,
  MediaItemRepositorySymbol,
} from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import {
  TvEpisodeWatchRepositoryInterface,
  TvEpisodeWatchRepositorySymbol,
} from "@/repositories/tvEpisodeWatch/TvEpisodeWatchRepositoryInterface"
import {
  TvWatchCycleRepositoryInterface,
  TvWatchCycleRepositorySymbol,
} from "@/repositories/tvWatchCycle/TvWatchCycleRepositoryInterface"
import {
  BulkCreateTvEpisodeWatchDto,
  CreateTvEpisodeWatchDto,
} from "@/services/tvEpisodeWatches/dto/createTvEpisodeWatch.dto"
import { TvEpisodeWatchNotFoundError, TvEpisodeWatchUnauthorizedError } from "@/shared/errors/tvEpisodeWatch"
import { TvWatchCycleNotActiveError, TvWatchCycleNotFoundError } from "@/shared/errors/tvWatchCycle"

@Injectable()
export class TvEpisodeWatchesService {
  constructor(
    @Inject(TvEpisodeWatchRepositorySymbol)
    private readonly tvEpisodeWatchRepository: TvEpisodeWatchRepositoryInterface,
    @Inject(TvWatchCycleRepositorySymbol)
    private readonly tvWatchCycleRepository: TvWatchCycleRepositoryInterface,
    @Inject(MediaItemRepositorySymbol)
    private readonly mediaItemRepository: MediaItemRepositoryInterface,
  ) {}

  private async getCycle(watchCycleId: string): Promise<TvWatchCycleType> {
    const cycle = await this.tvWatchCycleRepository.getById(watchCycleId)

    if (!cycle) {
      throw new TvWatchCycleNotFoundError({ tvWatchCycleId: watchCycleId })
    }

    return cycle
  }

  private checkOwnership(cycle: TvWatchCycleType, userId: string) {
    if (cycle.userId !== userId) {
      throw new TvEpisodeWatchUnauthorizedError({ userId })
    }
  }

  private checkCycleIsActive(cycle: TvWatchCycleType) {
    if (cycle.finishedAt) {
      throw new TvWatchCycleNotActiveError({ tvWatchCycleId: cycle.id })
    }
  }

  async getByCycleId(args: { watchCycleId: string, userId: string }) {
    const cycle = await this.getCycle(args.watchCycleId)
    this.checkOwnership(cycle, args.userId)

    return this.tvEpisodeWatchRepository.getByCycleId(args.watchCycleId)
  }

  async create(args: { userId: string, body: CreateTvEpisodeWatchDto }) {
    const cycle = await this.getCycle(args.body.watchCycleId)
    this.checkOwnership(cycle, args.userId)
    this.checkCycleIsActive(cycle)

    const mediaItem = await this.mediaItemRepository.getById(cycle.mediaItemId)

    return this.tvEpisodeWatchRepository.create({
      watchCycleId: cycle.id,
      userId: args.userId,
      mediaId: cycle.mediaId,
      mediaDetailsId: mediaItem?.mediaDetailsId,
      seasonNumber: args.body.seasonNumber,
      episodeNumber: args.body.episodeNumber,
    })
  }

  async createBulk(args: { userId: string, body: BulkCreateTvEpisodeWatchDto }) {
    const cycle = await this.getCycle(args.body.watchCycleId)
    this.checkOwnership(cycle, args.userId)
    this.checkCycleIsActive(cycle)

    const mediaItem = await this.mediaItemRepository.getById(cycle.mediaItemId)

    await this.tvEpisodeWatchRepository.createMany(args.body.episodes.map(episode => ({
      watchCycleId: cycle.id,
      userId: args.userId,
      mediaId: cycle.mediaId,
      mediaDetailsId: mediaItem?.mediaDetailsId,
      seasonNumber: episode.seasonNumber,
      episodeNumber: episode.episodeNumber,
    })))

    return this.tvEpisodeWatchRepository.getByCycleId(cycle.id)
  }

  async delete(args: { id: string, userId: string }) {
    const watch = await this.tvEpisodeWatchRepository.getById(args.id)

    if (!watch) {
      throw new TvEpisodeWatchNotFoundError({ tvEpisodeWatchId: args.id })
    }

    const cycle = await this.getCycle(watch.watchCycleId)
    this.checkOwnership(cycle, args.userId)

    return this.tvEpisodeWatchRepository.delete(args.id)
  }
}
