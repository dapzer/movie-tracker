<script lang="ts" setup>

import UiContainer from "~/components/ui/UiContainer.vue";
import { useAuth } from "~/composables/useAuth";
import { watchEffect } from "#imports";
import { navigateTo } from "#app";
import { UserRoleEnum } from "@movie-tracker/types";
import UiTypography from "~/components/ui/UiTypography.vue";
import { DashboardControls } from "~/features/dashboard";

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

      <DashboardControls />
    </template>
  </UiContainer>
</template>

<style lang="scss" module>

</style>
