import { MediaTypeEnum } from "@movie-tracker/types"
import { Inject, Injectable } from "@nestjs/common"
import {
  MediaItemRepositoryInterface,
  MediaItemRepositorySymbol,
} from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import {
  MediaListRepositoryInterface,
  MediaListRepositorySymbol,
} from "@/repositories/mediaList/MediaListRepositoryInterface"
import {
  TvEpisodeWatchRepositoryInterface,
  TvEpisodeWatchRepositorySymbol,
} from "@/repositories/tvEpisodeWatch/TvEpisodeWatchRepositoryInterface"
import {
  TvWatchCycleRepositoryInterface,
  TvWatchCycleRepositorySymbol,
} from "@/repositories/tvWatchCycle/TvWatchCycleRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"
import { BadArgumentsError } from "@/shared/errors/core"
import { MediaItemNotFoundError } from "@/shared/errors/mediaItem"
import { TvWatchCycleUnauthorizedError } from "@/shared/errors/tvWatchCycle"

@Injectable()
export class TvWatchCyclesService {
  constructor(
    @Inject(TvWatchCycleRepositorySymbol)
    private readonly tvWatchCycleRepository: TvWatchCycleRepositoryInterface,
    @Inject(TvEpisodeWatchRepositorySymbol)
    private readonly tvEpisodeWatchRepository: TvEpisodeWatchRepositoryInterface,
    @Inject(MediaListRepositorySymbol)
    private readonly mediaListRepository: MediaListRepositoryInterface,
    @Inject(MediaItemRepositorySymbol)
    private readonly mediaItemRepository: MediaItemRepositoryInterface,
    private readonly drizzleService: DrizzleService,
  ) {}

  private async getMediaListByMediaItemId(mediaItemId: string) {
    const mediaList = await this.mediaListRepository.getByMediaItemId({ mediaItemId })

    if (!mediaList) {
      throw new MediaItemNotFoundError({ mediaItemId })
    }

    return mediaList
  }

  async getByMediaItemId(args: { mediaItemId: string, userId: string }) {
    const mediaList = await this.getMediaListByMediaItemId(args.mediaItemId)

    if (mediaList.userId !== args.userId) {
      throw new TvWatchCycleUnauthorizedError({ userId: args.userId })
    }

    return this.tvWatchCycleRepository.getAllByMediaItemId(args.mediaItemId)
  }

  async getActiveByMediaItemId(args: { mediaItemId: string, userId: string }) {
    const mediaList = await this.getMediaListByMediaItemId(args.mediaItemId)

    if (mediaList.userId !== args.userId) {
      throw new TvWatchCycleUnauthorizedError({ userId: args.userId })
    }

    const cycle = await this.tvWatchCycleRepository.getActiveByMediaItemId(args.mediaItemId)

    if (!cycle) {
      return null
    }

    const episodeWatches = await this.tvEpisodeWatchRepository.getByCycleId(cycle.id)

    return {
      ...cycle,
      episodeWatches,
    }
  }

  async startNewCycle(args: { mediaItemId: string, userId: string }) {
    const mediaList = await this.getMediaListByMediaItemId(args.mediaItemId)

    if (mediaList.userId !== args.userId) {
      throw new TvWatchCycleUnauthorizedError({ userId: args.userId })
    }

    const mediaItem = await this.mediaItemRepository.getById(args.mediaItemId)

    if (!mediaItem) {
      throw new MediaItemNotFoundError({ mediaItemId: args.mediaItemId })
    }

    if (mediaItem.mediaType !== MediaTypeEnum.TV) {
      throw new BadArgumentsError("Watch cycles can only be created for TV media items.")
    }

    return this.tvWatchCycleRepository.startNewCycle({
      mediaItemId: args.mediaItemId,
      userId: args.userId,
      mediaId: mediaItem.mediaId,
    })
  }

  async cloneByMediaItemId(args: {
    sourceMediaItemId: string
    targetMediaItemId: string
    targetUserId: string
  }) {
    return this.drizzleService.runInTransaction(async () => {
      const sourceCycles = await this.tvWatchCycleRepository.getAllByMediaItemId(args.sourceMediaItemId)

      if (!sourceCycles.length) {
        return []
      }

      const insertedCycles = await this.tvWatchCycleRepository.createMany(sourceCycles.map(cycle => ({
        mediaItemId: args.targetMediaItemId,
        userId: args.targetUserId,
        mediaId: cycle.mediaId,
        cycleNumber: cycle.cycleNumber,
        startedAt: cycle.startedAt,
        finishedAt: cycle.finishedAt,
      })))

      const sourceWatches = await this.tvEpisodeWatchRepository.getByCycleIds(sourceCycles.map(cycle => cycle.id))

      if (sourceWatches.length) {
        const cycleIdByCycleNumber = new Map(insertedCycles.map(cycle => [cycle.cycleNumber, cycle.id]))
        const cycleNumberBySourceId = new Map(sourceCycles.map(cycle => [cycle.id, cycle.cycleNumber]))

        await this.tvEpisodeWatchRepository.createMany(sourceWatches.map(watch => ({
          watchCycleId: cycleIdByCycleNumber.get(cycleNumberBySourceId.get(watch.watchCycleId)!)!,
          userId: args.targetUserId,
          mediaId: watch.mediaId,
          mediaDetailsId: watch.mediaDetailsId,
          seasonNumber: watch.seasonNumber,
          episodeNumber: watch.episodeNumber,
          watchedAt: watch.watchedAt,
        })))
      }

      return insertedCycles
    })
  }
}
