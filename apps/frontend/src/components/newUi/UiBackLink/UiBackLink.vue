<script setup lang="ts">
import { NuxtLink } from "#components"
import { UiTypography } from "~/components/newUi/UiTypography"
import { ArrowRightBoldIcon } from "~/components/ui/icons"

interface UiBackLinkProps {
  text?: string;
  url: string;
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
    <ArrowRightBoldIcon />
    {{ props.text ?? $t("ui.back") }}
  </uitypography>
</template>

<style module lang="scss">
.body {
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 20px;
    transform: rotate(180deg);
  }
}
</style>
