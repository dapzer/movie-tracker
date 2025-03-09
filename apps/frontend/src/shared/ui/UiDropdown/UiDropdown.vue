<script setup lang="ts">
import { DropdownMenuContent, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from "radix-vue"

interface UiDropdown {
  triggerClass?: string
  indent?: number
  align?: "start" | "center" | "end"
  side?: "top" | "right" | "bottom" | "left"
}

defineOptions({
  inheritAttrs: false,
})
const props = withDefaults(defineProps<UiDropdown>(), {
  indent: 0,
  align: "start",
})
const model = defineModel<boolean>()
</script>

<template>
  <DropdownMenuRoot v-model:open="model">
    <DropdownMenuTrigger
      :class="[$style.trigger, [
        props.triggerClass,
      ]]"
    >
      <slot name="trigger" />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        :class="$style.contentWrapper"
        :align="props.align"
        :side="props.side"
        :side-offset="props.indent"
        :collision-padding="24"
        update-position-strategy="always"
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
