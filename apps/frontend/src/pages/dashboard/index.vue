<script lang="ts" setup>

import { useAuth } from "~/composables/useAuth";
import { watchEffect } from "#imports";
import { navigateTo } from "#app";
import { UserRoleEnum } from "@movie-tracker/types";
import { DashboardAnalyticsRecords, DashboardControls } from "~/features/dashboard";
import { useLocalePath } from "#i18n"
import { UiContainer } from "../../shared/ui/UiContainer"
import { UiTypography } from "../../shared/ui/UiTypography"
import { UiDivider } from "../../shared/ui/UiDivider"

const { isNotAuthorized, profile, isLoadingProfile } = useAuth();
const localePath = useLocalePath()

watchEffect(() => {
  if ((isNotAuthorized.value || !profile.value?.roles.includes(UserRoleEnum.ADMIN)) && !isLoadingProfile.value) {
    navigateTo(localePath("/"));
  }
});

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
