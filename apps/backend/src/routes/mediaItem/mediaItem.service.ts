import {
  MediaItemRepositoryInterface,
  MediaItemRepositorySymbol,
} from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import {
  MediaListRepositoryInterface,
  MediaListRepositorySymbol,
} from "@/repositories/mediaList/MediaListRepositoryInterface"
import { MediaDetailsService } from "@/routes/mediaDetails/mediaDetails.service"
import {
  MediaItemType,
  MediaTypeEnum,
} from "@movie-tracker/types"
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common"

@Injectable()
export class MediaItemService {
  constructor(
    @Inject(MediaListRepositorySymbol)
    private readonly mediaListRepository: MediaListRepositoryInterface,
    @Inject(MediaItemRepositorySymbol)
    private readonly mediaItemRepository: MediaItemRepositoryInterface,
    private readonly mediaDetailsService: MediaDetailsService,
  ) {}

  private async isMediaListOwner(mediaListId: string, userId: string) {
    const mediaList
      = await this.mediaListRepository.getMedialListById(mediaListId)

    if (!mediaList) {
      throw new HttpException(
        `Media list with id '${mediaListId}' doesn't exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    return mediaList.userId === userId
  }

  private async isMediaItemOwner(
    id: string,
    userId: string,
    mediaItemBase?: MediaItemType,
  ) {
    const mediaItem
      = mediaItemBase ?? (await this.mediaItemRepository.getMediaItemById(id))
    const isMediaListOwner = await this.isMediaListOwner(
      mediaItem.mediaListId,
      userId,
    )

    if (!mediaItem) {
      throw new HttpException(
        `Media item with id '${id}' doesn't exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    return isMediaListOwner
  }

  async createMediaItem(
    mediaId: number,
    mediaType: MediaTypeEnum,
    mediaListId: string,
    userId: string,
  ) {
    const mediaList
      = await this.mediaListRepository.getMedialListById(mediaListId)

    if (!mediaList) {
      throw new HttpException(
        `Media list with id '${mediaListId}' doesn't exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    if (mediaList.userId !== userId) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }

    const mediaDetails
      = await this.mediaDetailsService.createOrUpdateMediaDetails(
        mediaId,
        mediaType,
        null,
      )

    return this.mediaItemRepository.createMediaItem(
      mediaId,
      mediaType,
      mediaListId,
      mediaDetails.id,
    )
  }

  async getMediaItemsByUserId(userId: string) {
    return this.mediaItemRepository.getMediaItemsByUserId(userId)
  }

  async getMediaItemsByListId(
    mediaListId: string,
    userId: string,
    byHumanFriendlyId = false,
  ) {
    const mediaList = byHumanFriendlyId
      ? await this.mediaListRepository.getMedialListByHumanFriendlyId(
        mediaListId,
      )
      : await this.mediaListRepository.getMedialListById(mediaListId)

    if (mediaList && mediaList.userId !== userId && !mediaList.isPublic) {
      throw new HttpException(`Unauthorized.`, HttpStatus.UNAUTHORIZED)
    }

    return this.mediaItemRepository.getMediaItemsByListId(mediaList.id)
  }

  async deleteMediaItem(id: string, userId: string) {
    const isMediaItemOwner = await this.isMediaItemOwner(id, userId)

    if (!isMediaItemOwner) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }

    return this.mediaItemRepository.deleteMediaItem(id)
  }

  async updateMediaItem(
    id: string,
    userId: string,
    data: Partial<Pick<MediaItemType, "mediaDetailsId" | "mediaListId">>,
  ) {
    const isMediaItemOwner = await this.isMediaItemOwner(id, userId)

    if (!isMediaItemOwner) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }

    return this.mediaItemRepository.updateMediaItem(id, data)
  }

  async createMediaItemClone(
    id: string,
    userId: string,
    mediaListId: string,
    isSaveCreationDate = false,
  ) {
    const isMediaItemOwner = await this.isMediaItemOwner(id, userId)
    const isMediaListOwner = await this.isMediaListOwner(mediaListId, userId)

    if (!isMediaItemOwner || !isMediaListOwner) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }

    const mediaItem = await this.mediaItemRepository.getMediaItemById(id)

    return this.mediaItemRepository.createMediaItemWithExistedData(
      mediaItem.mediaId,
      mediaItem.mediaType,
      mediaListId,
      mediaItem.mediaDetailsId,
      mediaItem.trackingData,
      isSaveCreationDate ? mediaItem.createdAt : undefined,
    )
  }
}
