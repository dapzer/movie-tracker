<script lang="ts" setup>
import { useI18n, useSeoMeta } from "#imports"
import { UserRoleEnum } from "@movie-tracker/types"
import { DashboardAnalyticsRecords, DashboardControls, DashboardTabs } from "~/features/dashboard"
import { useProtectedRoute } from "~/shared/composables/useProtectedRoute"
import { UiContainer } from "../../shared/ui/UiContainer"

useProtectedRoute([UserRoleEnum.ADMIN])

const { t } = useI18n()

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("dashboard.tabs.systemManagement")} | ${t("dashboard.title")} | ${titleChunk}`
  },
  ogTitle() {
    return `%s | ${t("dashboard.tabs.systemManagement")} | ${t("dashboard.title")}`
  },
})
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <DashboardTabs tab="systemManagement">
      <div :class="$style.body">
        <DashboardAnalyticsRecords />
        <DashboardControls />
      </div>
    </DashboardTabs>
  </UiContainer>
</template>

<style lang="scss" module>
.wrapper {
  margin-top: 60px !important;
}
.body {
  padding-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
