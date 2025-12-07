import { CreateNotificationArgsType, NotificationType } from "@movie-tracker/types"

export const NotificationRepositorySymbol = Symbol("NotificationRepository")

export interface NotificationRepositoryInterface {
  createNotification: (args: CreateNotificationArgsType) => Promise<NotificationType>
}
