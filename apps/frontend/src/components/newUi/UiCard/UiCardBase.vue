<script lang="ts" setup>
import { NuxtLink } from "#components";

interface UiCardBaseProps {
  width?: number | string;
  height?: number | string;
  linkUrl?: string;
  // For horizontal card only
  imageWidth?: number | string;
  horizontal?: boolean;
}

const props = defineProps<UiCardBaseProps>()
</script>

<template>
  <div
    :class="[$style.wrapper, {
      [$style.horizontal]: props.horizontal
    }]"
    :style="{
      '--maxWidth': Number.isInteger(props.width) ? `${props.width}px` : (props.width || 'unset'),
      '--maxHeight': Number.isInteger(props.height) ? `${props.height}px` : (props.height || 'unset'),
      '--imageMaxWidth': Number.isInteger(props.imageWidth) ? `${props.imageWidth}px` : (props.imageWidth || 'unset')
    }"
  >
    <component
      :is="!!props.linkUrl ? NuxtLink : 'div'"
      :class="$style.imageWrapper"
      :href="props.linkUrl ?? ''"
    >
      <slot name="image" />
    </component>

    <div :class="$style.info">
      <slot name="content" />
    </div>
  </div>
</template>

<style lang="scss" module>
@import "~/styles/mixins";
@import "~/styles/newVariables";

.wrapper {
  @include card();
  max-width: var(--maxWidth);
  max-height: var(--maxHeight);

  &.horizontal {
    flex-direction: row;
    align-items: flex-start;

    .imageWrapper {
      max-width: var(--imageMaxWidth);
    }
  }

  .imageWrapper {
    display: flex;
    width: 100%;
    border-radius: var(--s-border-radius-small);
    height: fit-content;
    position: relative;

    img {
      border-radius: var(--s-border-radius-small);
      object-fit: cover;
    }
  }

  .info {
    width: 100%;
  }
}

</style>
