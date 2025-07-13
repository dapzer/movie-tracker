<script setup lang="ts" generic="T extends { id?: string | number }">
import { UiDivider } from "~/shared/ui/UiDivider"

interface UiListsGridVerticalProps {
  items: T[]
}

const props = defineProps<UiListsGridVerticalProps>()
</script>

<template>
  <div :class="$style.wrapper">
    <template
      v-for="(item, index) in props.items"
      :key="item?.id || index"
    >
      <slot :item="item" />
      <UiDivider
        v-if="index < props.items.length - 1"
        :class="$style.divider"
      />
    </template>
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/breakpoints";
@import "~/shared/styles/mixins";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;

  @include mobileDevice {
    gap: 16px;

    .divider {
      display: none;
    }
  }
}
</style>
