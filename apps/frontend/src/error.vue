<script lang="ts" setup>
import type { NuxtError } from "#app";
import UiTypography from "~/components/ui/UiTypography.vue";
import UiButton from "~/components/ui/UiButton.vue";
import UiContainer from "~/components/ui/UiContainer.vue";

interface ErrorPageProps {
  error: NuxtError;
}

const props = defineProps<ErrorPageProps>();
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <UiTypography variant="title2">
      {{ props.error?.statusCode }}
    </UiTypography>
    <UiTypography variant="title">
      {{ props.error?.message }}
    </UiTypography>
    <NuxtLink to="/">
      <UiButton>
        {{ $t("ui.actions.backToMainPage") }}
      </UiButton>
    </NuxtLink>
  </UiContainer>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
  text-align: center;

  a {
    margin-top: 24px;
  }
}
</style>
