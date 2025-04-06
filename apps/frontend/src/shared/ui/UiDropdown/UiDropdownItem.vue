<script setup lang="ts">
import type { ComponentOrTag } from "~/shared/types/ComponentOrTag"
import { DropdownMenuItem } from "radix-vue"

interface UiDropdownItemProps {
  as?: ComponentOrTag
}

const props = defineProps<UiDropdownItemProps>()
const slots = defineSlots()
</script>

<template>
  <DropdownMenuItem
    :as="props.as"
    :class="$style.wrapper"
  >
    <div
      v-if="slots.iconStart"
      :class="$style.icon"
    >
      <slot name="iconStart" />
    </div>
    <slot name="content" />
    <div
      v-if="slots.iconEnd"
      :class="[$style.iconEnd, $style.icon]"
    >
      <slot name="iconEnd" />
    </div>
  </DropdownMenuItem>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";

.wrapper {
  @include dropdownItem;
}
</style>
