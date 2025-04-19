<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from "radix-vue"
import { UiIcon } from "~/shared/ui/UiIcon"

interface UiTooltipProps {
  disabled?: boolean
  align?: "start" | "center" | "end"
  side?: "top" | "right" | "bottom" | "left"
}

const props = defineProps<UiTooltipProps>()
</script>

<template>
  <template v-if="props.disabled">
    <slot name="trigger" />
  </template>
  <template v-else>
    <TooltipProvider>
      <TooltipRoot :delay-duration="0">
        <TooltipTrigger
          as="div"
          :class="$style.trigger"
        >
          <slot name="trigger" />
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            :class="$style.content"
            :side-offset="12"
            :align="props.align"
            :side="props.side"
            :collision-padding="{
              top: 68,
              right: 24,
              bottom: 24,
              left: 24,
            }"
          >
            <TooltipArrow
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
