import {
  MEDIA_LIST_COUNT_LIMIT,
  MediaListAccessLevelEnum,
  MediaListType,
  NotificationTypeEnum,
} from "@movie-tracker/types"
import { Inject, Injectable, Logger } from "@nestjs/common"
import {
  MediaItemRepositoryInterface,
  MediaItemRepositorySymbol,
} from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import {
  MediaListRepositoryInterface,
  MediaListRepositorySymbol,
} from "@/repositories/mediaList/MediaListRepositoryInterface"
import { CreateMediaListDto } from "@/services/mediaList/dto/createMediaList.dto"
import { CreateMediaListCloneDto } from "@/services/mediaList/dto/createMediaListClone.dto"
import { UpdateMediaListDto } from "@/services/mediaList/dto/updateMediaList.dto"
import { NotificationService } from "@/services/notification/notification.service"
import {
  MediaListLimitReachedError,
  MediaListNotFoundError,
  MediaListSelfDislikeError,
  MediaListSelfLikeError,
  MediaListUnauthorizedError,
  SystemMediaListDeletionError,
} from "@/shared/errors/mediaList"

@Injectable()
export class MediaListService {
  private readonly logger = new Logger("MediaListService")

  constructor(
    @Inject(MediaListRepositorySymbol)
    private readonly mediaListRepository: MediaListRepositoryInterface,
    @Inject(MediaItemRepositorySymbol)
    private readonly mediaItemRepository: MediaItemRepositoryInterface,
    private readonly notificationService: NotificationService,
  ) {
  }

  private async isListOwner(
    id: string,
    currentUserId: string,
    mediaListBase?: MediaListType,
  ) {
    const mediaList
      = mediaListBase ?? (await this.mediaListRepository.getById({ id }))

    if (!mediaList) {
      throw new MediaListNotFoundError({ mediaListId: id })
    }

    return mediaList.userId === currentUserId
  }

  private async isMediaListsLimitReached(userId: string) {
    const mediaListsCount = await this.mediaListRepository.getCountByUserId(userId)

    if (mediaListsCount >= MEDIA_LIST_COUNT_LIMIT) {
      throw new MediaListLimitReachedError({ userId, limit: MEDIA_LIST_COUNT_LIMIT })
    }

    return false
  }

  async getById(
    id: string,
    currentUserId: string,
    byHumanFriendlyId = false,
  ) {
    const mediaList = byHumanFriendlyId
      ? await this.mediaListRepository.getByHumanFriendlyId({
          id,
          currentUserId,
        })
      : await this.mediaListRepository.getById({ id, currentUserId })
    const isListOwner = await this.isListOwner(id, currentUserId, mediaList)

    if (!isListOwner && (mediaList.accessLevel === MediaListAccessLevelEnum.PRIVATE)) {
      throw new MediaListUnauthorizedError({ userId: currentUserId, mediaListId: id })
    }

    return mediaList
  }

  async getByUserId(userId: string, currentUserId: string, isPublicOnly?: boolean) {
    return this.mediaListRepository.getByUserId({
      userId,
      currentUserId,
      isPublicOnly,
    })
  }

  async create(userId: string, body?: CreateMediaListDto) {
    await this.isMediaListsLimitReached(userId)
    return this.mediaListRepository.create({
      userId,
      isSystem: false,
      body,
    })
  }

  async update(id: string, body: UpdateMediaListDto, userId: string) {
    const isListOwner = await this.isListOwner(id, userId)

    if (!isListOwner) {
      throw new MediaListUnauthorizedError({ userId, mediaListId: id })
    }

    return this.mediaListRepository.update({ id, body })
  }

  async delete(id: string, userId: string) {
    const mediaList = await this.mediaListRepository.getById({ id })
    const isListOwner = await this.isListOwner(id, userId, mediaList)

    if (!isListOwner) {
      throw new MediaListUnauthorizedError({ userId, mediaListId: id })
    }

    if (mediaList.isSystem) {
      throw new SystemMediaListDeletionError({ mediaListId: id })
    }

    return this.mediaListRepository.delete(id)
  }

  async createClone(
    id: string,
    userId: string,
    body: CreateMediaListCloneDto,
  ) {
    await this.isMediaListsLimitReached(userId)

    const mediaList = await this.mediaListRepository.getById({ id })

    if (!mediaList) {
      throw new MediaListNotFoundError({ mediaListId: id })
    }

    if (mediaList.accessLevel === MediaListAccessLevelEnum.PRIVATE && mediaList.userId !== userId) {
      throw new MediaListUnauthorizedError({ userId, mediaListId: id })
    }

    const mediaItems = await this.mediaItemRepository.getByListId({
      mediaListId: id,
    })
    const newMediaList = await this.mediaListRepository.create({
      userId,
      isSystem: false,
      body: {
        title: body.title,
        accessLevel: MediaListAccessLevelEnum.PRIVATE,
      },
    })

    await this.mediaItemRepository.createMany(mediaItems.items.map(el => ({
      mediaId: el.mediaId,
      mediaType: el.mediaType,
      mediaListId: newMediaList.id,
      mediaDetailsId: el.mediaDetailsId,
      currentStatus: body.isKeepStatus
        ? el.trackingData.currentStatus
        : undefined,
    })))

    return newMediaList
  }

  async createLike(mediaListId: string, userId: string) {
    const mediaList = await this.mediaListRepository.getById({ id: mediaListId })
    const isListOwner = await this.isListOwner(mediaListId, userId, mediaList)

    if (isListOwner) {
      throw new MediaListSelfLikeError({ userId, mediaListId })
    }

    const mediaListLike = await this.mediaListRepository.createLike({
      mediaListId,
      userId,
    })

    if (mediaList) {
      await this.notificationService.create({
        userId: mediaList.userId,
        type: NotificationTypeEnum.MEDIA_LIST_LIKE,
        meta: {
          actorUserId: userId,
          mediaListId: mediaList.id,
          mediaListLikeId: mediaListLike.id,
        },
        createdAt: mediaListLike.createdAt,
      }).catch((err) => {
        this.logger.error("Failed to create media list like notification", err)
      })
    }

    return { ...mediaListLike, mediaListHumanFriendlyId: mediaList.humanFriendlyId }
  }

  async deleteLike(mediaListId: string, userId: string) {
    const mediaList = await this.mediaListRepository.getById({ id: mediaListId })
    const isListOwner = await this.isListOwner(mediaListId, userId, mediaList)

    if (isListOwner) {
      throw new MediaListSelfDislikeError({ userId, mediaListId })
    }

    const mediaListLike = await this.mediaListRepository.deleteLike({
      mediaListId,
      userId,
    })
    return { ...mediaListLike, mediaListHumanFriendlyId: mediaList.humanFriendlyId }
  }
}
