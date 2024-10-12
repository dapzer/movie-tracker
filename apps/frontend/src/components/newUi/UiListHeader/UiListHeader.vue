<script setup lang="ts">
import { UiDivider } from "~/components/newUi/UiDivider"
import { UiTypography } from "~/components/newUi/UiTypography"

interface UiListHeaderProps {
  title?: string;
  subtitle?: string;
}

const props = defineProps<UiListHeaderProps>();
</script>


<template>
  <div :class="$style.wrapper">
    <div :class="$style.header">
      <UiTypography
        :class="$style.title"
        as="h3"
        variant="title3"
      >
        {{ props.title }}
      </UiTypography>
      <div :class="$style.filters">
        <slot name="filters" />
      </div>
    </div>
    <UiDivider />
    <UiTypography
      :class="$style.subheading"
      variant="subheading"
    >
      {{ props.subtitle }}
    </UiTypography>
  </div>
</template>


<style module lang="scss">
@import "~/styles/newVariables";
@import "~/styles/mixins";

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
