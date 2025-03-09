<script lang="ts" setup>
import { navigateTo } from "#app"
import { useLocalePath } from "#i18n"
import { watchEffect } from "#imports"
import { UserRoleEnum } from "@movie-tracker/types"
import { useAuth } from "~/composables/useAuth"
import { DashboardAnalyticsRecords, DashboardControls } from "~/features/dashboard"
import { UiContainer } from "../../shared/ui/UiContainer"
import { UiDivider } from "../../shared/ui/UiDivider"
import { UiTypography } from "../../shared/ui/UiTypography"

const { isNotAuthorized, profile, isLoadingProfile } = useAuth()
const localePath = useLocalePath()

watchEffect(() => {
  if ((isNotAuthorized.value || !profile.value?.roles.includes(UserRoleEnum.ADMIN)) && !isLoadingProfile.value) {
    navigateTo(localePath("/"))
  }
})
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <UiTypography
      v-if="isLoadingProfile"
      variant="title2"
    >
      {{ $t("ui.loading") }}
    </UiTypography>

    <template v-else>
      <UiTypography variant="title2">
        {{ $t("dashboard.title") }}
      </UiTypography>
      <UiDivider />
      <div :class="$style.body">
        <DashboardAnalyticsRecords />
        <DashboardControls />
      </div>
    </template>
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
