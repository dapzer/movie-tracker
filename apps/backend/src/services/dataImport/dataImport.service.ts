import { Buffer } from "node:buffer"
import {
  DataImportBucketType,
  DataImportMediaType,
  DataImportRawResultType,
  DataImportSourceEnum,
  DataImportStatusEnum,
  MediaItemStatusNameEnum,
  MediaListAccessLevelEnum,
  MediaTypeEnum,
} from "@movie-tracker/types"
import { Inject, Injectable } from "@nestjs/common"
import {
  DataImportRepositoryInterface,
  DataImportRepositorySymbol,
} from "@/repositories/dataImport/DataImportRepositoryInterface"
import {
  MediaItemRepositoryInterface,
  MediaItemRepositorySymbol,
} from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import { ProcessDataImportDto } from "@/services/dataImport/dto/processDataImport.dto"
import { DataImportProvidersService } from "@/services/dataImport/providers/providers.service"
import { MediaItemsService } from "@/services/mediaItems/mediaItems.service"
import { MediaListsService } from "@/services/mediaLists/mediaLists.service"
import {
  DataImportInvalidStatusError,
  DataImportNotFoundError,
  DataImportUnauthorizedError,
} from "@/shared/errors/dataImport"
import { extractArchiveData } from "@/shared/utils/extractArchiveData"

@Injectable()
export class DataImportService {
  constructor(
    private readonly providersService: DataImportProvidersService,
    @Inject(DataImportRepositorySymbol)
    private readonly dataImportRepository: DataImportRepositoryInterface,
    @Inject(MediaItemRepositorySymbol)
    private readonly mediaItemRepository: MediaItemRepositoryInterface,
    private readonly mediaItemsService: MediaItemsService,
    private readonly mediaListsService: MediaListsService,
  ) {}

  async import(args: { userId: string, source: DataImportSourceEnum, archive: Buffer | Uint8Array }): Promise<{ importId: string, result: DataImportRawResultType }> {
    const provider = this.providersService.findService(args.source)
    const files = await extractArchiveData(args.archive)

    provider.validateFiles({ files })

    const result = await provider.import({ files })
    const dataImport = await this.dataImportRepository.create({
      userId: args.userId,
      source: args.source,
      result,
    })

    return { importId: dataImport.id, result }
  }

  async getById(args: { id: string, userId: string }) {
    const dataImport = await this.dataImportRepository.getById({ id: args.id })

    if (!dataImport) {
      throw new DataImportNotFoundError({ dataImportId: args.id })
    }

    if (dataImport.userId !== args.userId) {
      throw new DataImportUnauthorizedError({ userId: args.userId, dataImportId: args.id })
    }

    return dataImport
  }

  async getByUserId(args: { userId: string, limit?: number, offset?: number }) {
    return this.dataImportRepository.getByUserId(args)
  }

  private toMediaType(type: DataImportMediaType["type"]): MediaTypeEnum {
    return MediaTypeEnum[type.toUpperCase() as keyof typeof MediaTypeEnum]
  }

  private async createMediaItemsFromBucket(args: {
    userId: string
    bucket: DataImportBucketType<DataImportMediaType>
    mediaListId: string
    status: MediaItemStatusNameEnum
  }) {
    if (!args.bucket.success.length) {
      return { created: 0, skipped: [] }
    }

    const existingMediaItems = await this.mediaItemRepository.getByListId({
      mediaListId: args.mediaListId,
      withoutLimit: true,
    })
    const existingMediaIds = new Set(existingMediaItems.items.map(item => item.mediaId))

    const newMedia = args.bucket.success.filter(media => !existingMediaIds.has(media.ids.tmdbId))
    const skipped = args.bucket.success
      .filter(media => existingMediaIds.has(media.ids.tmdbId))
      .map(media => media.ids.tmdbId)

    if (!newMedia.length) {
      return { created: 0, skipped }
    }

    const createdMediaItems = await this.mediaItemsService.createBulk({
      userId: args.userId,
      items: newMedia.map(media => ({
        mediaId: media.ids.tmdbId,
        mediaType: this.toMediaType(media.type),
        mediaListId: args.mediaListId,
        currentStatus: args.status,
      })),
    })

    return { created: createdMediaItems.length, skipped }
  }

  async process(args: { id: string, userId: string, config: ProcessDataImportDto }) {
    const dataImport = await this.getById({ id: args.id, userId: args.userId })

    if (dataImport.status === DataImportStatusEnum.PROCESSING || dataImport.status === DataImportStatusEnum.COMPLETED) {
      throw new DataImportInvalidStatusError({ dataImportId: args.id, status: dataImport.status })
    }

    await this.dataImportRepository.updateStatus({ id: args.id, status: DataImportStatusEnum.PROCESSING })

    const summary = { createdMediaLists: 0, createdMediaItems: 0, skippedMediaItems: [] as number[] }

    try {
      for (const bucketKey of ["watched", "watchList"] as const) {
        const config = args.config[bucketKey]

        if (!config) {
          continue
        }

        let mediaListId = config.mediaListId

        if (!mediaListId) {
          const mediaList = await this.mediaListsService.create(args.userId, {
            title: config.newListTitle!,
            accessLevel: MediaListAccessLevelEnum.PRIVATE,
          })
          mediaListId = mediaList.id
          summary.createdMediaLists += 1
        }

        const bucketResult = await this.createMediaItemsFromBucket({
          userId: args.userId,
          bucket: dataImport.result[bucketKey],
          mediaListId,
          status: config.status,
        })
        summary.createdMediaItems += bucketResult.created
        summary.skippedMediaItems.push(...bucketResult.skipped)
      }

      if (args.config.lists) {
        for (const list of dataImport.result.lists.success) {
          const mediaList = await this.mediaListsService.create(args.userId, {
            title: list.title,
            description: list.description,
            accessLevel: list.isPrivate ? MediaListAccessLevelEnum.PRIVATE : MediaListAccessLevelEnum.PUBLIC,
          })
          summary.createdMediaLists += 1

          const bucketResult = await this.createMediaItemsFromBucket({
            userId: args.userId,
            bucket: list.items,
            mediaListId: mediaList.id,
            status: args.config.lists.status,
          })
          summary.createdMediaItems += bucketResult.created
          summary.skippedMediaItems.push(...bucketResult.skipped)
        }
      }

      await this.dataImportRepository.updateStatus({
        id: args.id,
        status: DataImportStatusEnum.COMPLETED,
        processedAt: new Date(),
      })

      return summary
    }
    catch (error) {
      await this.dataImportRepository.updateStatus({ id: args.id, status: DataImportStatusEnum.FAILED })
      throw error
    }
  }
}
