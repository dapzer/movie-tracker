<script setup lang="ts">

import { UiTypography } from "../../../shared/ui/UiTypography"
import { UiDivider } from "../../../shared/ui/UiDivider"

interface DashboardCardProps {
  title: string;
}

const props = defineProps<DashboardCardProps>()
</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography variant="title3">
      {{ props.title }}
    </UiTypography>
    <UiDivider />
    <slot />
  </div>
</template>

<style module lang="scss">
@import "~/styles/mixins";
@import "~/styles/variables";

.wrapper {
  @include card;
  background: var(--c-card-background-hovered);
  max-width: max-content;
}
</style>
