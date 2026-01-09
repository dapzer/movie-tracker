import type { NotificationCountType, PaginationType } from "@movie-tracker/types"
import type { Ref } from "vue"
import { useRequestHeaders } from "#app"
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import {
  getNotificationCountApi,
  getNotificationsApi,
  markAllNotificationsAsRead,
  markNotificationsAsRead,
} from "~/api/notifications/notificationsApi"
import { NotificationsApiQueryKeys } from "~/api/notifications/notificationsApiQueryKeys"

export function useGetNotificationsApi(args: Ref<PaginationType>) {
  return useQuery({
    queryKey: [NotificationsApiQueryKeys.NOTIFICATIONS, args],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])

      if (!headers.cookie?.includes("session") && import.meta.server) {
        throw new Error("No session cookie found")
      }

      return getNotificationsApi(args.value, { headers })
    },
    refetchOnMount: true,
  })
}

export function useGetNotificationCountApi() {
  return useQuery({
    queryKey: [NotificationsApiQueryKeys.NOTIFICATION_COUNT],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])

      if (!headers.cookie?.includes("session") && import.meta.server) {
        throw new Error("No session cookie found")
      }

      return getNotificationCountApi({ headers })
    },
  })
}

export function useMarkNotificationsAsReadApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [NotificationsApiQueryKeys.MARK_AS_READ],
    mutationFn: markNotificationsAsRead,
    onSuccess: (data) => {
      queryClient.setQueryData<NotificationCountType>([NotificationsApiQueryKeys.NOTIFICATION_COUNT], (oldData) => {
        if (!oldData) {
          return oldData
        }
        return {
          ...oldData,
          unread: Math.max(0, oldData.unread - data.length),
        }
      })
    },
  })
}

export function useMarkAllNotificationsAsReadApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [NotificationsApiQueryKeys.MARK_ALL_AS_READ],
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.setQueryData<NotificationCountType>([NotificationsApiQueryKeys.NOTIFICATION_COUNT], (oldData) => {
        if (!oldData) {
          return oldData
        }
        return {
          ...oldData,
          unread: 0,
        }
      })
    },
  })
}
