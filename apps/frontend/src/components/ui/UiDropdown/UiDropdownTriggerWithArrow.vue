<script setup lang="ts">

import { UiIcon } from "~/components/ui/UiIcon"

interface UiDropdownTriggerWithArrowProps {
  isOpen: boolean
}

const props = defineProps<UiDropdownTriggerWithArrowProps>()
</script>

<template>
  <div :class="$style.wrapper">
    <slot />
    <UiIcon
      name="icon:arrow"
      :class="[$style.arrow, {
        [$style.opened]: props.isOpen
      }]"
    />
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  align-items: center;
  gap: 7px;

  .arrow {
    color: var(--c-description);
    width: 10px;

    &.opened {
      transform: rotate(180deg);
    }
  }
}
</style>
