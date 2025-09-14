import { MEDIA_LIST_COUNT_LIMIT, MediaItemType, MediaListAccessLevelEnum, MediaListType } from "@movie-tracker/types"
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common"
import {
  MediaItemRepositoryInterface,
  MediaItemRepositorySymbol,
} from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import {
  MediaListRepositoryInterface,
  MediaListRepositorySymbol,
} from "@/repositories/mediaList/MediaListRepositoryInterface"
import { CreateMediaListDto } from "@/routes/mediaList/dto/createMediaList.dto"
import { CreateMediaListCloneDto } from "@/routes/mediaList/dto/createMediaListClone.dto"
import { UpdateMediaListDto } from "@/routes/mediaList/dto/updateMediaList.dto"

@Injectable()
export class MediaListService {
  constructor(
    @Inject(MediaListRepositorySymbol)
    private readonly mediaListRepository: MediaListRepositoryInterface,
    @Inject(MediaItemRepositorySymbol)
    private readonly mediaItemRepository: MediaItemRepositoryInterface,
  ) {
  }

  private async isListOwner(
    id: string,
    currentUserId: string,
    mediaListBase?: MediaListType,
  ) {
    const mediaList
      = mediaListBase ?? (await this.mediaListRepository.getMedialListById(id))

    if (!mediaList) {
      throw new HttpException(
        `Media list with id '${id}' doesn't exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    return mediaList.userId === currentUserId
  }

  private async isMediaListsLimitReached(userId: string) {
    const mediaListsCount = await this.mediaListRepository.getMediaListsCountByUserId(userId)

    if (mediaListsCount >= MEDIA_LIST_COUNT_LIMIT) {
      throw new HttpException(
        `You have reached the limit of ${MEDIA_LIST_COUNT_LIMIT} media lists.`,
        HttpStatus.FORBIDDEN,
      )
    }

    return false
  }

  async getMedialListById(
    id: string,
    currentUserId: string,
    byHumanFriendlyId = false,
  ) {
    const mediaList = byHumanFriendlyId
      ? await this.mediaListRepository.getMedialListByHumanFriendlyId(
          id,
          currentUserId,
        )
      : await this.mediaListRepository.getMedialListById(id, currentUserId)
    const isListOwner = await this.isListOwner(id, currentUserId, mediaList)

    if (!isListOwner && (mediaList.accessLevel === MediaListAccessLevelEnum.PRIVATE)) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }

    return mediaList
  }

  async getMedialListsByUserId(userId: string, currentUserId: string) {
    const isPublicOnly = userId !== currentUserId

    if (!userId) {
      throw new HttpException("User ID is required.", HttpStatus.BAD_REQUEST)
    }

    return this.mediaListRepository.getMedialListsByUserId(
      userId,
      currentUserId,
      isPublicOnly,
    )
  }

  async createMediaList(userId: string, body?: CreateMediaListDto) {
    await this.isMediaListsLimitReached(userId)
    return this.mediaListRepository.createMediaList(userId, false, body)
  }

  async updateMediaList(id: string, body: UpdateMediaListDto, userId: string) {
    const isListOwner = await this.isListOwner(id, userId)

    if (!isListOwner) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }

    return this.mediaListRepository.updateMediaList(id, body)
  }

  async deleteMediaList(id: string, userId: string) {
    const mediaList = await this.mediaListRepository.getMedialListById(id)
    const isListOwner = await this.isListOwner(id, userId, mediaList)

    if (!isListOwner) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }

    if (mediaList.isSystem) {
      throw new HttpException(
        "System media list cannot be deleted.",
        HttpStatus.BAD_REQUEST,
      )
    }

    return this.mediaListRepository.deleteMediaList(id)
  }

  async createMediaListClone(
    id: string,
    userId: string,
    body: CreateMediaListCloneDto,
  ) {
    await this.isMediaListsLimitReached(userId)

    const mediaList = await this.mediaListRepository.getMedialListById(id)

    if (!mediaList) {
      throw new HttpException(
        `Media list with id '${id}' doesn't exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    if (mediaList.accessLevel === MediaListAccessLevelEnum.PRIVATE && mediaList.userId !== userId) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }

    const mediaItems = await this.mediaItemRepository.getMediaItemsByListId(id)
    const newMediaList = await this.mediaListRepository.createMediaList(
      userId,
      false,
      {
        title: body.title,
        accessLevel: MediaListAccessLevelEnum.PRIVATE,
      },
    )

    const promises: Promise<MediaItemType>[] = []

    for (const mediaItem of mediaItems) {
      if (
        body.selectedStatuses.includes(mediaItem.trackingData.currentStatus)
      ) {
        promises.push(
          this.mediaItemRepository.createMediaItem(
            mediaItem.mediaId,
            mediaItem.mediaType,
            newMediaList.id,
            mediaItem.mediaDetailsId,
            undefined,
            body.isKeepStatus
              ? mediaItem.trackingData.currentStatus
              : undefined,
          ),
        )
      }
    }

    await Promise.all(promises)

    return newMediaList
  }

  async createMediaListLike(mediaListId: string, userId: string) {
    const mediaList = await this.mediaListRepository.getMedialListById(mediaListId)
    const isListOwner = await this.isListOwner(mediaListId, userId, mediaList)

    if (isListOwner) {
      throw new HttpException(
        "You cannot like your own media list.",
        HttpStatus.BAD_REQUEST,
      )
    }

    const mediaListLike = await this.mediaListRepository.createMediaListLike(mediaListId, userId)
    return { ...mediaListLike, mediaListHumanFriendlyId: mediaList.humanFriendlyId }
  }

  async deleteMediaListLike(mediaListId: string, userId: string) {
    const mediaList = await this.mediaListRepository.getMedialListById(mediaListId)
    const isListOwner = await this.isListOwner(mediaListId, userId, mediaList)

    if (isListOwner) {
      throw new HttpException(
        "You cannot dislike your own media list.",
        HttpStatus.BAD_REQUEST,
      )
    }

    const mediaListLike = await this.mediaListRepository.deleteMediaListLike(mediaListId, userId)
    return { ...mediaListLike, mediaListHumanFriendlyId: mediaList.humanFriendlyId }
  }
}
