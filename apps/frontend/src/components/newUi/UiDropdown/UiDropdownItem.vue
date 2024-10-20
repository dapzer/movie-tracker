<script setup lang="ts">

import { DropdownMenuItem } from "radix-vue"
import type { ComponentOrTag } from "~/types/ComponentOrTag"

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
.wrapper {
  padding: 6px;
  color: var(--c-text);
  font-size: var(--fs-label);
  line-height: var(--lh-label);
  font-weight: var(--fw-medium);
  font-family: var(--ff-inter);

  display: flex;
  align-items: center;
  gap: 6px;
  outline: none;

  .icon {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .iconEnd {
    justify-self: flex-end;
  }

  &:active,
  &:focus,
  &:hover {
    cursor: pointer;
    background: var(--c-card-background-hovered);
  }
}
</style>
