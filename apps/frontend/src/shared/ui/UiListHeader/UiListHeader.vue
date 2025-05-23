<script setup lang="ts">
import type { ComponentOrTag } from "~/shared/types/ComponentOrTag"
import type { UiTypographyVariant } from "~/shared/ui/UiTypography"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiTypography } from "~/shared/ui/UiTypography"

interface UiListHeaderProps {
  title?: string
  subtitle?: string
  titleAs?: ComponentOrTag
  titleVariant?: UiTypographyVariant
}

const props = withDefaults(defineProps<UiListHeaderProps>(), {
  titleVariant: "title3",
  titleAs: "h3",
})
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.header">
      <UiTypography
        :class="$style.title"
        :as="props.titleAs"
        :variant="props.titleVariant"
      >
        {{ props.title }}
      </UiTypography>
      <div :class="$style.filters">
        <slot name="controls" />
      </div>
    </div>
    <UiDivider />
    <UiTypography
      v-if="props.subtitle"
      :class="$style.subheading"
      variant="subheading"
    >
      {{ props.subtitle }}
    </UiTypography>
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/breakpoints";
@import "~/shared/styles/mixins";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;

    .title {
      width: max-content;
      @include ellipsisText();

      @include mobileDevice() {
        white-space: wrap;
        width: 100%;
      }
    }

    @include mobileDevice() {
      flex-direction: column;
      align-items: flex-start;
    }

    .filters {
      display: flex;
      gap: 20px;
      flex: 1 1 auto;
      max-height: max-content;
      justify-content: flex-end;

      @include mobileDevice() {
        width: 100%;
        justify-content: flex-start;
      }
    }
  }

  .subheading {
    color: var(--c-description);
  }
}
</style>
