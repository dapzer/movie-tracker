<script setup lang="ts">
import { NuxtLink } from "#components"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiTypography } from "~/shared/ui/UiTypography"

interface UiBackLinkProps {
  text?: string
  url: string
}

const props = defineProps<UiBackLinkProps>()
</script>

<template>
  <UiTypography
    :class="$style.body"
    :as="NuxtLink"
    :to="props.url"
    variant="label"
    schema="link"
  >
    <UiIcon
      :class="$style.icon"
      :size="20"
      name="icon:arrow-right-bold"
    />
    {{ props.text ?? $t("ui.back") }}
  </uitypography>
</template>

<style module lang="scss">
.body {
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 8px;

  .icon {
    transform: rotate(180deg);
  }
}
</style>
