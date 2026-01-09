<script setup lang="ts">
import type { NotificationType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed } from "vue"
import NotificationItem from "~/features/notifications/ui/popup/NotificationItem.vue"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiTypography } from "~/shared/ui/UiTypography"

interface NotificationGroupProps {
  date: string
  notifications: NotificationType[]
}

const props = defineProps<NotificationGroupProps>()
const { locale } = useI18n()

const dateString = computed(() => {
  const date = new Date(props.date)

  if (date.toLocaleDateString() === new Date().toLocaleDateString()) {
    return undefined
  }

  if (date.getFullYear() !== new Date().getFullYear()) {
    return date.toLocaleDateString(locale.value, { year: "numeric", month: "long", day: "numeric" })
  }
  else {
    return date.toLocaleDateString(locale.value, { month: "long", day: "numeric" })
  }
})
</script>

<template>
  <div
    v-if="dateString"
    :class="$style.titleWrapper"
  >
    <UiTypography
      :class="$style.title"
      variant="description"
    >
      {{ dateString }}
    </UiTypography>
  </div>
  <template
    v-for="(el, index) in props.notifications"
    :key="el.id"
  >
    <NotificationItem
      :notification="el"
    />
    <UiDivider v-if="index < props.notifications.length - 1" />
  </template>
</template>

<style module lang="scss">
.titleWrapper {
  background-color: var(--c-charcoal);
  padding: 6px 12px;
}

.title {
  font-size: var(--fs-badge);
  color: var(--c-white-75);
  font-weight: var(--fw-medium);
  text-transform: uppercase;
}
</style>
