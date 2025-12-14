<script setup lang="ts">
import { useGetNotificationCountApi } from "~/api/notifications/useNotificationsApi"
import NotificationList from "~/features/notifications/ui/popup/NotificationList.vue"
import NotificationsPopupTrigger from "~/features/notifications/ui/popup/NotificationsPopupTrigger.vue"
import { UiPopover } from "~/shared/ui/UiPopover"

const getNotificationCountApi = useGetNotificationCountApi()
await getNotificationCountApi.suspense()
</script>

<template>
  <UiPopover
    :indent="10"
    align="end"
  >
    <template #trigger>
      <NotificationsPopupTrigger
        :notification-count="getNotificationCountApi.data.value"
      />
    </template>
    <template #content>
      <NotificationList />
    </template>
  </UiPopover>
</template>

<style scoped lang="scss">

</style>
