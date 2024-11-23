<script setup lang="ts">

import { UiTypography } from "~/components/newUi/UiTypography"
import { UiDivider } from "~/components/newUi/UiDivider"

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
@import "~/styles/newVariables";

.wrapper {
  @include card;
  background: var(--c-card-background-hovered);
  max-width: max-content;
}
</style>
