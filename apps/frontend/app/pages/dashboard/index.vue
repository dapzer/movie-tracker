<script lang="ts" setup>
import { UserRoleEnum } from "@movie-tracker/types"
import { DashboardAnalyticsRecords, DashboardControls } from "~/features/dashboard"
import { useProtectedRoute } from "~/shared/composables/useProtectedRoute"
import { UiContainer } from "../../shared/ui/UiContainer"
import { UiDivider } from "../../shared/ui/UiDivider"
import { UiTypography } from "../../shared/ui/UiTypography"

useProtectedRoute([UserRoleEnum.ADMIN])
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <UiTypography variant="title2">
      {{ $t("dashboard.title") }}
    </UiTypography>
    <UiDivider />
    <div :class="$style.body">
      <DashboardAnalyticsRecords />
      <DashboardControls />
    </div>
  </UiContainer>
</template>

<style lang="scss" module>
.wrapper {
  margin-top: 60px !important;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.body {
  padding-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
