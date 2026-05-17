<script setup lang="ts">
import { useLocalePath } from "#i18n"
import { ref } from "vue"
import { UiTabsPane } from "~/shared/ui/UiTabs"
import { UiTypography } from "~/shared/ui/UiTypography"

type DashboardTab = "systemManagement" | "reviewsModeration"

interface DashboardTabsProps {
  tab: DashboardTab
}

const props = defineProps<DashboardTabsProps>()

const localePath = useLocalePath()
const activeTab = ref<DashboardTab>(props.tab)
</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography variant="title2">
      {{ $t("dashboard.title") }}
    </UiTypography>
    <UiTabsPane
      v-model="activeTab"
      :tabs="[
        {
          key: 'systemManagement',
          label: $t('dashboard.tabs.systemManagement'),
          href: localePath('/dashboard'),
        },
        {
          key: 'reviewsModeration',
          label: $t('dashboard.tabs.reviewsModeration'),
          href: localePath('/dashboard/moderation/reviews'),
        },
      ] as const"
    >
      <template #content>
        <slot />
      </template>
    </UiTabsPane>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
