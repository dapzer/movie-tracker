<script setup lang="ts">
import type { NotificationType, PaginationType } from "@movie-tracker/types"
import { computed } from "vue"
import { useGetNotificationsApi } from "~/api/notifications/useNotificationsApi"
import NotificationGroup from "~/features/notifications/ui/popup/NotificationGroup.vue"
import { UiTypography } from "~/shared/ui/UiTypography"

const getNotificationsApiArgs = computed<PaginationType>(() => {
  return {
    offset: 0,
    limit: 20,
  }
})

const getNotifications = useGetNotificationsApi(getNotificationsApiArgs)

const notificationGroups = computed(() => {
  const groupsByDate = new Map<string, NotificationType[]>()

  for (const notification of getNotifications.data.value?.items || []) {
    const date = new Date(notification.createdAt)
    const dateKey = date.toLocaleDateString()

    if (!groupsByDate.has(dateKey)) {
      groupsByDate.set(dateKey, [])
    }

    groupsByDate.get(dateKey)?.push(notification)
  }

  return groupsByDate
})
</script>

<template>
  <div :class="$style.wrapper">
    <template v-if="getNotifications.data.value?.items.length">
      <template
        v-for="([date, notifications]) in notificationGroups"
        :key="date"
      >
        <NotificationGroup
          :date="date"
          :notifications="notifications"
        />
      </template>
    </template>
    <template v-else>
      <UiTypography>
        No notifications available.
      </UiTypography>
    </template>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  max-height: 608px;
}
</style>
