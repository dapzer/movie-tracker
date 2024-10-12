<script lang="ts" setup>

import UiTypography from "~/components/ui/UiTypography.vue";
import UiDivider from "~/components/ui/UiDivider.vue";

interface UiContentCardProps {
  title?: string;
  width?: number;
}

const props = defineProps<UiContentCardProps>()
</script>

<template>
  <div
    :class="$style.wrapper"
    :style="{
      '--maxWidth': props.width ? `${props.width}px` : 'fit-content'
    }"
  >
    <UiTypography
      :class="$style.title"
      variant="title2"
    >
      {{ props.title }}
    </UiTypography>

    <UiDivider />

    <div :class="$style.body">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" module>
@import "~/styles/mixins";
@import "~/styles/newVariables";

.wrapper {
  @include card;
  max-width: var(--maxWidth);

  .title {
    text-align: center;
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
