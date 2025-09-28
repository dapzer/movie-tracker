<script setup lang="ts">
import AccountSettingsMediaRatingsAccessForm
  from "~/features/accountSettings/ui/AccountSettingsMediaRatingsAccessForm.vue"
import AccountSettingsNameForm from "~/features/accountSettings/ui/AccountSettingsNameForm.vue"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiTypography } from "~/shared/ui/UiTypography"
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <UiTypography
      as="h1"
      variant="title2"
    >
      {{ $t("accountSettings.pageTitle") }}
    </UiTypography>

    <div :class="$style.content">
      <AccountSettingsNameForm />
      <UiDivider />
      <AccountSettingsMediaRatingsAccessForm />
    </div>
  </UiContainer>
</template>

<style module lang="scss">
.wrapper {
  max-width: 768px;
  margin-top: 70px;
}

.content {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
