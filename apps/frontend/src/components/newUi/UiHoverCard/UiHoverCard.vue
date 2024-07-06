<script setup lang="ts">
import { HoverCardArrow, HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger } from "radix-vue"
import type { ComponentOrTag } from "~/types/ComponentOrTag"
import { CardArrowTopIcon } from "~/components/ui/icons"

interface UiHoverCardProps {
  as?: ComponentOrTag
  indent?: number
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
}

const props = withDefaults(defineProps<UiHoverCardProps>(), {
  indent: 0,
  as: 'div',
  align: 'start',
  side: 'bottom'
})

defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <HoverCardRoot
    :openDelay="0"
    :closeDelay="0"
  >
    <HoverCardTrigger
      :class="$style.trigger"
      :as="props.as"
      v-bind="$attrs"
    >
      <slot name="trigger" />
    </HoverCardTrigger>

    <HoverCardPortal>
      <HoverCardContent
        :class="$style.contentWrapper"
        :align="props.align"
        :side="props.side"
        :sideOffset="props.indent"
        updatePositionStrategy="always"
      >
        <div :class="$style.content">
          <slot name="content" />
        </div>

        <HoverCardArrow
          as="div"
          :class="$style.arrow"
        >
          <CardArrowTopIcon />
        </HoverCardArrow>
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>

<style module lang="scss">
.trigger {
  width: max-content;
}

.contentWrapper {
  z-index: var(--i-hover-card);
  width: max-content;
  max-width: min(var(--radix-hover-card-content-available-width), var(--s-container));
  cursor: auto;

  .arrow {
    will-change: transform, opacity;
    display: flex !important;
    align-items: center;
    justify-content: center;
  }

  &[data-side="right"][data-align="start"],
  &[data-side="right"][data-align="end"],
  &[data-side="left"][data-align="start"],
  &[data-side="left"][data-align="end"] {
    & > span {
      top: 16px !important;
      visibility: visible !important;
    }
  }
}

.content {
  display: flex;
  padding: 16px;
  flex-direction: column;
  gap: 16px;
  background: var(--c-card-background-hovered);
  max-height: var(--radix-hover-card-content-available-height);
  overflow-y: auto;
  max-width: max-content;
  border-radius: var(--s-border-radius-medium);
}
</style>
