<script lang="ts" setup>
import type { NuxtError } from "#app"
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { UiButton } from "~/shared/ui/UiButton"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiTypography } from "~/shared/ui/UiTypography"

interface ErrorPageProps {
  error: NuxtError
}

const props = defineProps<ErrorPageProps>()

const localePath = useLocalePath()
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <UiTypography variant="title2">
      {{ props.error?.statusCode }}
    </UiTypography>
    <UiTypography variant="title">
      {{ props.error?.message }}
    </UiTypography>
    <UiButton
      :as="NuxtLink"
      :to="localePath('/')"
    >
      {{ $t("ui.actions.backToMainPage") }}
    </UiButton>
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
