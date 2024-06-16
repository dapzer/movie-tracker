<script lang="ts" setup>
import { NuxtLink } from "#components";

interface UiCardBaseProps {
  width?: number;
  linkUrl?: string;
}

const props = defineProps<UiCardBaseProps>()
</script>

<template>
  <div
    :class="[$style.wrapper]"
    :style="{
      '--maxWidth': Number.isInteger(props.width) ? `${props.width}px` : (props.width || 'unset')
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

.wrapper {
  @include card();
  max-width: var(--maxWidth);

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
