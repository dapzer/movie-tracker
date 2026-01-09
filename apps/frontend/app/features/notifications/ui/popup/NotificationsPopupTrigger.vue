<script setup lang="ts">
import type { NotificationCountType } from "@movie-tracker/types"
import { computed } from "vue"
import { UiBadge } from "~/shared/ui/UiBadge"
import { UiIcon } from "~/shared/ui/UiIcon"

interface NotificationsPopupTriggerProps {
  notificationCount?: NotificationCountType
}

const props = defineProps<NotificationsPopupTriggerProps>()

const value = computed(() => {
  if (!props.notificationCount?.unread) {
    return undefined
  }
  if (props.notificationCount.unread > 9) {
    return "9+"
  }
  return props.notificationCount.unread
})
</script>

<template>
  <div :class="$style.wrapper">
    <UiIcon
      name="icon:bell"
      :width="18"
      :height="20"
    />
    <UiBadge
      v-if="value"
      :class="[$style.badge]"
    >
      {{ value }}
    </UiBadge>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  position: relative;
}

.badge {
  position: absolute;
  top: -8px;
  right: -8px;
}
</style>
