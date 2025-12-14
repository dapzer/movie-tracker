<script setup lang="ts">
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from "radix-vue"

export type UiPopoverAlign = "start" | "center" | "end"
export type UiPopoverSide = "top" | "right" | "bottom" | "left"

interface UiPopoverProps {
  triggerClass?: string
  indent?: number
  align?: UiPopoverAlign
  side?: UiPopoverSide
  asChild?: boolean
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<UiPopoverProps>(), {
  indent: 0,
  align: "start",
})

const model = defineModel<boolean>()
</script>

<template>
  <PopoverRoot v-model:open="model">
    <PopoverTrigger
      :as-child="props.asChild"
      :class="[$style.trigger, [
        props.triggerClass,
      ]]"
    >
      <slot name="trigger" />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        v-bind="$attrs"
        :class="$style.contentWrapper"
        :align="props.align"
        :side="props.side"
        :side-offset="props.indent"
        :collision-padding="24"
        update-position-strategy="always"
      >
        <slot name="content" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<style module lang="scss">
.trigger {
  all: unset;
  cursor: pointer;
  width: fit-content;
}

.contentWrapper {
  z-index: var(--i-popover);
  width: max-content;
  cursor: auto;
  overflow-y: auto;
  max-width: min(var(--radix-popover-content-available-width), var(--s-container));
  max-height: var(--radix-popover-content-available-height);
  padding: 10px;
  background: var(--c-card-background-hovered);
  border: 1px solid var(--c-charcoal);
  border-radius: var(--s-border-radius-medium);
}
</style>
