<script lang="ts" setup>
import { NuxtLink } from "#components";
import UiTypography from "~/components/ui/UiTypography.vue";

interface UiCardBaseProps {
  width?: number;
  link?: string;
  isHorizontal?: boolean;
  isSmall?: boolean;
}

const props = withDefaults(defineProps<UiCardBaseProps>(), {
  width: 300,
});

</script>

<template>
  <div
    :class="[$style.wrapper, {
      [$style.horizontal]: props.isHorizontal,
      [$style.small]: props.isSmall
    }]"
    :style="{
      '--maxWidth': `${props.width}px`
    }"
  >
    <component
      :is="link ? NuxtLink : 'div'"
      :class="$style.imageWrapper"
      :href="props.link ?? ''"
    >
      <slot name="image" />
    </component>

    <div :class="$style.info">
      <UiTypography
        :class="$style.description"
        as="span"
        variant="textSmall"
      >
        <slot name="description" />
      </UiTypography>

      <UiTypography
        :class="$style.title"
      >
        <slot name="title" />
      </UiTypography>

      <slot />
    </div>
  </div>
</template>

<style lang="scss" module>
@import "~/styles/mixins";
@import "~/styles/variables";

.wrapper {
  @include card;
  max-width: var(--maxWidth);

  .imageWrapper {
    width: 100%;
    border-radius: var(--s-border-radius);
    height: fit-content;
    position: relative;

    img {
      border-radius: var(--s-border-radius);
      object-fit: contain;
    }
  }

  .info {
    width: 100%;

    .title {
      color: var(--c-secondary);
    }
  }

  &.horizontal {
    flex-direction: row;
    max-width: unset;
    height: unset;
    gap: 40px;

    .imageWrapper {
      max-width: 150px;
      min-width: 150px;
    }
  }

  &.small {
    @media screen and (min-width: 450px){
      max-width: 200px;
      min-width: 200px;
      gap: 10px;

      .title {
        font-size: 1em;
      }

      a,
      .description {
        font-size: .9em;
      }
    }

    @media screen and (max-width: 450px){
      max-width: unset;
    }
  }

  @media screen and (max-width: $bp-md){
    max-width: unset;

    &.horizontal {
      flex-direction: column;
      gap: 14px;

      .imageWrapper {
        max-width: unset;
      }
    }
  }
}

</style>
