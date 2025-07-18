<script setup lang="ts">
import type { VNode } from "vue"
import {
  SelectContent,
  SelectItem,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "radix-vue"
import { UiIcon } from "~/shared/ui/UiIcon"

export interface OptionType {
  value: string
  label: string
  icon?: string | VNode
}

type ValueGapSize = "default" | "large"

interface UiSelectProps {
  options: OptionType[]
  placeholder?: string
  width?: number
  valueGapSize?: ValueGapSize
}

const props = defineProps<UiSelectProps>()
const selectModel = defineModel<string>()
</script>

<template>
  <SelectRoot v-model="selectModel">
    <SelectTrigger
      v-bind="$attrs"
      :class="$style.trigger"
      :style="{
        '--width': props.width ? `${props.width}px` : 'unset',
      }"
    >
      <SelectValue
        :class="[$style.value, {
          [$style.valueLargeGap]: props.valueGapSize === 'large',
        }]"
        :placeholder="props.placeholder"
      />
      <SelectIcon :class="$style.iconWrapper">
        <UiIcon name="icon:select-arrow" />
      </SelectIcon>
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        :align-offset="0"
        :class="$style.content"
        position="popper"
      >
        <SelectViewport :class="$style.viewport">
          <SelectItem
            v-for="(option, index) in options"
            :key="index"
            :value="option.value"
            :class="$style.item"
          >
            <SelectItemText
              :class="[$style.value, {
                [$style.valueLargeGap]: props.valueGapSize === 'large',
              }]"
            >
              <component
                :is="option.icon"
                v-if="option.icon"
              />
              <span>
                {{ option.label }}
              </span>
            </SelectItemText>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";

.trigger {
  outline: none;
  background: var(--c-card-background-hovered);
  border: 1px solid var(--c-stroke);
  border-radius: var(--s-border-radius);
  padding: 8px 12px;
  width: 100%;
  max-width: var(--width);
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  &[data-state="open"] {
    background: var(--c-card-background-hovered);

    .iconWrapper {
      transform: rotate(180deg);
    }
  }

  &,
  .value {
    color: var(--c-text);
    font-size: var(--fs-label);
    font-weight: var(--fw-medium);
    font-family: var(--ff-inter);
  }

  .value {
    @include ellipsisText;
  }

  .iconWrapper {
    display: flex;
    align-items: center;
    width: 16px;
  }

  &:disabled {
    opacity: var(--s-disabled-opacity);
  }
}

.content {
  width: var(--radix-popper-anchor-width);
  max-height: var(--radix-select-content-available-height);
  background: var(--c-card-background);
  padding: 6px;
  border: 1px solid var(--c-stroke);
  z-index: var(--i-select);

  &[data-side="bottom"] {
    border-bottom-left-radius: var(--s-border-radius);
    border-bottom-right-radius: var(--s-border-radius);
    border-top: unset;
  }

  &[data-side="top"] {
    max-height: calc(var(--radix-select-content-available-height) - var(--s-header-height));
    border-top-left-radius: var(--s-border-radius);
    border-top-right-radius: var(--s-border-radius);
    border-bottom: unset;
  }

  .viewport {
    overflow: auto;
    @include scrollbar();
    scrollbar-width: unset;

    .item:not(:last-child) {
      margin-bottom: 8px;
    }
  }

  .item {
    padding: 6px;
    width: 100%;
    color: var(--c-text);
    min-width: 0;

    &:focus,
    &:hover,
    &:hover {
      border: unset;
      outline: none;
      cursor: pointer;
      background: var(--c-card-background-hovered);
    }
  }
}

.value {
  display: flex;
  gap: 4px;
  align-items: center;

  span {
    font-family: var(--ff-inter);
    font-size: var(--fs-label);
    font-weight: var(--fw-medium);
    @include ellipsisText;
  }

  svg {
    width: 16px;
    min-width: 16px;
  }
}

.valueLargeGap {
  gap: 6px;
}

body:has(.content[data-side="bottom"][data-state="open"]) .trigger[data-state="open"] {
  border-bottom: 1px solid transparent;
  border-radius: var(--s-border-radius) var(--s-border-radius) 0 0;
}

body:has(.content[data-side="top"][data-state="open"]) .trigger[data-state="open"] {
  border-top: 1px solid transparent;
  border-radius: 0 0 var(--s-border-radius) var(--s-border-radius);
}
</style>
