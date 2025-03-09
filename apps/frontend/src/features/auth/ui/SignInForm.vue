<script setup lang="ts">
import AuthProvidersList from "~/features/auth/ui/AuthProvidersList.vue"
import AuthTermsOfUse from "~/features/auth/ui/AuthTermsOfUse.vue"
import { UiTypography } from "~/shared/ui/UiTypography"
</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography
      :class="$style.title"
      as="h1"
      variant="title2"
    >
      {{ $t("auth.signIn") }}
    </UiTypography>
    <AuthProvidersList />
    <AuthTermsOfUse :class="$style.termsOfUse" />
  </div>
</template>

<style module lang="scss">
.wrapper {
  max-width: 384px;
  width: 100%;
  height: fit-content;
  padding: 20px;
  background-color: var(--c-main-background);

  .title {
    letter-spacing: -0.025em;
    margin-bottom: 30px;
  }

  .termsOfUse {
    margin-top: 20px;
  }
}
</style>
