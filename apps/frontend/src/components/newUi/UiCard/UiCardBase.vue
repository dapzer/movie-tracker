<script lang="ts" setup>
import { NuxtLink } from "#components";

export interface UiCardBaseProps {
  width?: number | string;
  height?: number | string;
  linkUrl?: string;
  fullHeight?: boolean;
  // For horizontal card only
  imageWidth?: number | string;
  horizontal?: boolean;
}

const props = defineProps<UiCardBaseProps>()
const slots = defineSlots()
</script>

<template>
  <div
    :class="[$style.wrapper, {
      [$style.horizontal]: props.horizontal,
      [$style.fullHeight]: props.fullHeight
    }]"
    :style="{
      '--maxWidth': Number.isInteger(props.width) ? `${props.width}px` : (props.width || 'unset'),
      '--maxHeight': Number.isInteger(props.height) ? `${props.height}px` : (props.height || 'unset'),
      '--imageMaxWidth': Number.isInteger(props.imageWidth) ? `${props.imageWidth}px` : (props.imageWidth || 'unset')
    }"
  >
    <template v-if="slots.precontent">
      <slot name="precontent" />
    </template>

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

@layer global, default;

@layer default {
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

    &.fullHeight {
      height: 100%;
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
      min-width: 0;
    }
  }
}

</style>

