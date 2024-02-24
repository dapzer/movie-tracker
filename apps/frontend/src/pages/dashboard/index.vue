<script lang="ts" setup>

import UiContainer from "~/components/ui/UiContainer.vue";
import { useAuth } from "~/composables/useAuth";
import { watchEffect } from "#imports";
import { navigateTo } from "#app";
import { UserRoleEnum } from "@movie-tracker/types";
import UiTypography from "~/components/ui/UiTypography.vue";
import { DashboardAnalyticsRecords, DashboardControls } from "~/features/dashboard";

const { isNotAuthorized, profile, isLoadingProfile } = useAuth();

watchEffect(() => {
  if ((isNotAuthorized.value || !profile.value?.roles.includes(UserRoleEnum.ADMIN)) && !isLoadingProfile.value) {
    navigateTo("/");
  }
});

</script>

<template>
  <UiContainer>
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

      <div :class="$style.body">
        <DashboardAnalyticsRecords />
        <DashboardControls />
      </div>
    </template>
  </UiContainer>
</template>

<style lang="scss" module>
.body {
  padding-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
