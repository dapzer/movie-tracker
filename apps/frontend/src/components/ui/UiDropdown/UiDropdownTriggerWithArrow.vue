<script setup lang="ts">

import { ArrowIcon } from "~/components/ui/icons"

interface UiDropdownTriggerWithArrowProps {
  isOpen: boolean
}

const props = defineProps<UiDropdownTriggerWithArrowProps>()
</script>

<template>
  <div :class="$style.wrapper">
    <slot />
    <ArrowIcon
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
