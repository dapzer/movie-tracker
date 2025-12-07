import { CreateNotificationArgsType, NotificationTypeEnum } from "@movie-tracker/types"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Inject, Injectable } from "@nestjs/common"
import { Cache } from "cache-manager"
import {
  NotificationRepositoryInterface,
  NotificationRepositorySymbol,
} from "@/repositories/notification/NotificationRepositoryInterface"
import { getMillisecondsFromDays } from "@/shared/utils/getMillisecondsFromDays"

@Injectable()
export class NotificationService {
  constructor(
    @Inject(NotificationRepositorySymbol) private readonly notificationRepository: NotificationRepositoryInterface,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
  }

  async create(args: CreateNotificationArgsType) {
    if (args.type === NotificationTypeEnum.USER_FOLLOW || args.type === NotificationTypeEnum.MEDIA_LIST_LIKE) {
      const existingNotificationKey = `notification:${args.userId}:${args.type}:${args.meta.actorUserId}`
      const existingNotification = await this.cacheManager.get(existingNotificationKey)

      if (existingNotification) {
        return null
      }

      await this.cacheManager.set(existingNotificationKey, true, getMillisecondsFromDays(1))
    }

    return this.notificationRepository.createNotification(args)
  }
}
