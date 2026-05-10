<script setup lang="ts">
// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
import type { TooltipContentProps } from "radix-vue/dist/Tooltip/TooltipContent"
import { useMediaQuery } from "@vueuse/core"
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from "radix-vue"
import { UiIcon } from "~/shared/ui/UiIcon"

export type UiTooltipSide = "top" | "right" | "bottom" | "left"
export type UiTooltipAlign = "start" | "center" | "end"

interface UiTooltipProps {
  disabled?: boolean
  align?: UiTooltipAlign
  side?: UiTooltipSide
  asChild?: boolean
  hideArrow?: boolean
  offset?: number
  contentClass?: string
  collisionPadding?: TooltipContentProps["collisionPadding"]
}

const props = withDefaults(defineProps<UiTooltipProps>(), {
  offset: 12,
  collisionPadding: {
    top: 68,
    right: 24,
    bottom: 24,
    left: 24,
  },
})

const mediaQueryTouch = useMediaQuery("(hover: none) and (pointer: coarse)")
const tooltipOpen = defineModel<boolean>({ default: () => false })

function handleTriggerClick() {
  if (mediaQueryTouch.value) {
    tooltipOpen.value = !tooltipOpen.value
  }
}
</script>

<template>
  <template v-if="props.disabled">
    <slot name="trigger" />
  </template>
  <template v-else>
    <TooltipProvider>
      <TooltipRoot
        v-model:open="tooltipOpen"
        :delay-duration="0"
        :disable-closing-trigger="true"
      >
        <TooltipTrigger
          as="div"
          :as-child="props.asChild"
          :class="$style.trigger"
          v-bind="$attrs"
          @click="handleTriggerClick"
        >
          <slot name="trigger" />
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            :class="[$style.content, props.contentClass]"
            :side-offset="props.offset"
            :align="props.align"
            :side="props.side"
            :collision-padding="props.collisionPadding"
          >
            <TooltipArrow
              v-if="!hideArrow"
              as="div"
              :class="$style.arrow"
            >
              <UiIcon
                name="icon:card-arrow-top"
                :width="14"
                :height="8"
              />
            </TooltipArrow>

            <slot name="content" />
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  </template>
</template>

<style module lang="scss">
.trigger {
  width: fit-content;
}

.content {
  z-index: var(--i-tooltip);
  padding: 12px;
  background: var(--c-tooltip-background);
  max-height: var(--radix-tooltip-content-available-height);
  width: max-content;
  max-width: min(var(--radix-tooltip-content-available-width), var(--s-container));
  border-radius: var(--s-border-radius-medium);
}

.arrow {
  will-change: transform, opacity;
  display: flex !important;
  align-items: center;
  justify-content: center;
}
</style>
