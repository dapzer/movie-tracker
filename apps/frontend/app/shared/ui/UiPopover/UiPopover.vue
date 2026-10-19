<script setup lang="ts">
import { PopoverArrow, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from "reka-ui"
import { UiIcon } from "~/shared/ui/UiIcon"

export type UiPopoverAlign = "start" | "center" | "end"
export type UiPopoverSide = "top" | "right" | "bottom" | "left"

interface UiPopoverProps {
  triggerClass?: string
  contentClass?: string
  width?: number
  indent?: number
  contentSpacing?: number
  align?: UiPopoverAlign
  side?: UiPopoverSide
  asChild?: boolean
  withArrow?: boolean
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<UiPopoverProps>(), {
  indent: 0,
  align: "start",
  contentSpacing: 10,
})

const model = defineModel<boolean>()
</script>

<template>
  <PopoverRoot v-model:open="model">
    <PopoverTrigger
      :as-child="props.asChild"
      :class="[props.triggerClass, {
        [$style.trigger]: !props.asChild,
      }]"
    >
      <slot name="trigger" />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        :class="[$style.contentWrapper, props.contentClass]"
        :style="{
          '--width': props.width ? `${props.width}px` : 'max-content',
        }"
        :align="props.align"
        :side="props.side"
        :side-offset="props.indent"
        :collision-padding="24"
        update-position-strategy="always"
      >
        <div
          v-bind="$attrs"
          :class="$style.content"
          :style="{
            '--spacing': `${props.contentSpacing}px`,
          }"
        >
          <slot name="content" />
        </div>

        <PopoverArrow
          v-if="props.withArrow"
          as="div"
          :class="$style.arrow"
        >
          <UiIcon
            name="icon:card-arrow-top"
            :width="14"
            :height="8"
          />
        </PopoverArrow>
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
  --ui-popover-background: var(--c-card-background-hovered);

  z-index: var(--i-popover);
  width: var(--width);
  cursor: auto;
  max-width: min(var(--reka-popover-content-available-width), var(--s-container));
  max-height: var(--reka-popover-content-available-height);

  .arrow {
    will-change: transform, opacity;
    display: flex !important;
    align-items: center;
    justify-content: center;
    color: var(--ui-popover-background);
  }
}

.content {
  overflow-y: auto;
  width: 100%;
  padding: var(--spacing);
  background: var(--ui-popover-background);
  border: 1px solid var(--c-charcoal);
  border-radius: var(--s-border-radius-medium);
}
</style>
