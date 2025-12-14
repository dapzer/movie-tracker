<script setup lang="ts">
import type { PaginationType } from "@movie-tracker/types"
import { computed } from "vue"
import { useGetNotificationsApi } from "~/api/notifications/useNotificationsApi"
import NotificationItem from "~/features/notifications/ui/popup/NotificationItem.vue"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiTypography } from "~/shared/ui/UiTypography"

const getNotificationsApiArgs = computed<PaginationType>(() => {
  return {
    offset: 0,
    limit: 20,
  }
})

const getNotifications = useGetNotificationsApi(getNotificationsApiArgs)
</script>

<template>
  <div :class="$style.wrapper">
    <template v-if="getNotifications.data.value?.items.length">
      <template
        v-for="(el, index) in getNotifications.data.value?.items"
        :key="el.id"
      >
        <NotificationItem
          :notification="el"
        />
        <UiDivider v-if="index < getNotifications.data.value.items.length - 1" />
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
}
</style>
