<script setup lang="ts">

import { DropdownMenuContent, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from "radix-vue"

interface UiDropdown {
  indent?: number
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
}

const props = withDefaults(defineProps<UiDropdown>(), {
  indent: 0,
  align: "start"
})

defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger
      :class="$style.trigger"
    >
      <slot name="trigger" />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        :class="$style.contentWrapper"
        :align="props.align"
        :side="props.side"
        :sideOffset="props.indent"
        :collisionPadding="24"
        updatePositionStrategy="always"
      >
        <div
          v-bind="$attrs"
          :class="$style.content"
        >
          <slot name="content" />
        </div>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<style module lang="scss">
.trigger {
  all: unset;
  cursor: pointer;
  width: fit-content;
}

.contentWrapper {
  z-index: var(--i-dropdown);
  width: max-content;
  max-width: min(var(--radix-dropdown-menu-content-available-width), var(--s-container));
  cursor: auto;
}

.content {
  display: flex;
  padding: 10px;
  flex-direction: column;
  gap: 10px;
  background: var(--c-card-background);
  max-height: var(--radix-dropdown-menu-content-available-height);
  overflow-y: auto;
  max-width: max-content;
  border-radius: var(--s-border-radius);
}
</style>
