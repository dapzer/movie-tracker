import type {
  NotificationCountType,
  NotificationResponseType,
  NotificationType,
  PaginationType,
} from "@movie-tracker/types"
import type { RequestOptions } from "@movie-tracker/utils"
import type { PostMarkNotificationsAsReadApiArgs } from "~/api/notifications/notificationsApiTypes"
import { api } from "~/api/instance"

export function getNotificationsApi(args: PaginationType, options?: RequestOptions) {
  return api.get<NotificationResponseType>("notification", {
    params: {
      limit: args.limit,
      offset: args.offset,
    },
    ...options,
  })
}

export function getNotificationCountApi(options?: RequestOptions) {
  return api.get<NotificationCountType>("notification/count", options)
}

export function markNotificationsAsRead(args: PostMarkNotificationsAsReadApiArgs) {
  return api.post<Array<NotificationType>>("notification", {
    ids: args.ids,
  })
}
export function markAllNotificationsAsRead() {
  return api.post<Array<NotificationType>>("notification/all")
}
