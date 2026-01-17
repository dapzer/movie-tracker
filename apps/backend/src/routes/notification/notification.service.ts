import {
  CreateNotificationArgsType,
  NotificationCountType,
  NotificationMetaType,
  NotificationResponseType,
  NotificationType,
  NotificationTypeEnum,
} from "@movie-tracker/types"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Inject, Injectable } from "@nestjs/common"
import { Cache } from "cache-manager"
import {
  NotificationRepositoryInterface,
  NotificationRepositorySymbol,
} from "@/repositories/notification/NotificationRepositoryInterface"
import { PaginationDto } from "@/shared/dto/pagination.dto"
import { getMillisecondsFromDays } from "@/shared/utils/getMillisecondsFromDays"

@Injectable()
export class NotificationService {
  constructor(
    @Inject(NotificationRepositorySymbol) private readonly notificationRepository: NotificationRepositoryInterface,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
  }

  async create<T extends NotificationTypeEnum>(args: CreateNotificationArgsType<T>): Promise<NotificationType> {
    let existingNotification = null
    let existingNotificationKey = null

    if (args.type === NotificationTypeEnum.USER_FOLLOW) {
      const meta = args.meta as unknown as Extract<NotificationMetaType, { type: NotificationTypeEnum.USER_FOLLOW }>
      existingNotificationKey = `notification:${args.userId}:${args.type}:${meta.actorUserId}`
      existingNotification = await this.cacheManager.get(existingNotificationKey)
    }
    else if (args.type === NotificationTypeEnum.MEDIA_LIST_LIKE) {
      const meta = args.meta as unknown as Extract<NotificationMetaType, { type: NotificationTypeEnum.MEDIA_LIST_LIKE }>
      existingNotificationKey = `notification:${args.userId}:${args.type}:${meta.actorUserId}:${meta.mediaListId}`
      existingNotification = await this.cacheManager.get(existingNotificationKey)
    }

    if (existingNotification) {
      return null
    }

    await this.cacheManager.set(existingNotificationKey, true, getMillisecondsFromDays(1))
    return this.notificationRepository.createNotification(args)
  }

  async createBulk(args: Array<CreateNotificationArgsType>): Promise<Array<NotificationType>> {
    return this.notificationRepository.createBulkNotifications(args)
  }

  async getByUserId(args: { userId: string } & PaginationDto): Promise<NotificationResponseType> {
    return this.notificationRepository.getNotificationsByUserId(args)
  }

  async markAsRead(args: { userId: string, ids: Array<string> }): Promise<Array<NotificationType>> {
    return this.notificationRepository.markNotificationsAsRead(args)
  }

  async markAllAsRead(args: { userId: string }): Promise<Array<NotificationType>> {
    return this.notificationRepository.markAllNotificationsAsRead(args)
  }

  async getCount(args: { userId: string }): Promise<NotificationCountType> {
    return this.notificationRepository.getNotificationCount(args)
  }
}
