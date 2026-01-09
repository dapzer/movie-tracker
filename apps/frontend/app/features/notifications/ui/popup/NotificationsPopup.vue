<script setup lang="ts">
import { useGetNotificationCountApi } from "~/api/notifications/useNotificationsApi"
import NotificationList from "~/features/notifications/ui/popup/NotificationList.vue"
import NotificationsPopupTrigger from "~/features/notifications/ui/popup/NotificationsPopupTrigger.vue"
import { UiPopover } from "~/shared/ui/UiPopover"
import { UiTypography } from "~/shared/ui/UiTypography"

const getNotificationCountApi = useGetNotificationCountApi()
await getNotificationCountApi.suspense()
</script>

<template>
  <UiPopover
    :indent="10"
    align="end"
    :class="$style.content"
    :width="318"
  >
    <template #trigger>
      <NotificationsPopupTrigger
        :notification-count="getNotificationCountApi.data.value"
      />
    </template>
    <template #content>
      <div :class="$style.titleWrapper">
        <UiTypography
          :class="$style.title"
          variant="description"
        >
          {{ $t("notifications.title") }}
        </UiTypography>
      </div>
      <NotificationList />
    </template>
  </UiPopover>
</template>

<style module lang="scss">
.content {
  padding: 0;
  width: 100%;
}

.titleWrapper {
  padding: 10px 12px;
  border-bottom: 1px solid var(--c-charcoal);
}

.title {
  font-weight: var(--fw-medium);
  color: var(--c-text);
}
</style>
