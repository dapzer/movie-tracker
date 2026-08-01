<script lang="ts" setup>
import type { DashboardTab } from "~/features/dashboard/ui/DashboardTabs.vue"
import { useRouteBaseName } from "#i18n"
import { useRoute } from "#imports"
import { UserRoleEnum } from "@movie-tracker/types"
import { computed } from "vue"
import { DashboardTabs } from "~/features/dashboard"
import { useProtectedRoute } from "~/shared/composables/useProtectedRoute"
import { UiContainer } from "~/shared/ui/UiContainer"

const dashboardRouteTabMap: Record<string, DashboardTab> = {
  "dashboard-system-management": "systemManagement",
  "dashboard-management-users": "usersManagement",
  "dashboard-management-user-bans": "userBansManagement",
  "dashboard-moderation-reviews": "reviewsModeration",
}

useProtectedRoute([UserRoleEnum.ADMIN])

const route = useRoute()
const routeBaseName = useRouteBaseName()

const activeTab = computed<DashboardTab>(() => {
  const name = routeBaseName(route) as string
  return dashboardRouteTabMap[name] ?? "systemManagement"
})
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <DashboardTabs :tab="activeTab">
      <NuxtPage />
    </DashboardTabs>
  </UiContainer>
</template>

<style lang="scss" module>
.wrapper {
  margin-top: 60px !important;
}
</style>
