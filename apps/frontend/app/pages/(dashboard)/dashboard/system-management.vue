<script lang="ts" setup>
import { useI18n, useSeoMeta } from "#imports"
import { DashboardAnalyticsRecords, DashboardControls } from "~/features/dashboard"

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
  <div :class="$style.body">
    <DashboardAnalyticsRecords />
    <DashboardControls />
  </div>
</template>

<style lang="scss" module>
.body {
  padding-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
