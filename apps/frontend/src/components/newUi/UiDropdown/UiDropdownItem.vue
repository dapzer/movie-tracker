<script setup lang="ts">

import { DropdownMenuItem } from "radix-vue"
import type { ComponentOrTag } from "~/types/ComponentOrTag"

interface UiDropdownItemProps {
  as?: ComponentOrTag
}

const props = defineProps<UiDropdownItemProps>()
</script>

<template>
  <DropdownMenuItem
    :as="props.as"
    :class="$style.wrapper"
  >
    <slot name="iconStart" />
    <slot name="content" />
    <div :class="$style.iconEnd">
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
