<script setup lang="ts">
import type { VNode } from "vue"
import type { UiIconName } from "~/shared/ui/UiIcon/UiIcon.vue"
import type { UiPopoverAlign } from "~/shared/ui/UiPopover/UiPopover.vue"
import { computed, ref } from "vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiPopover } from "~/shared/ui/UiPopover"

export interface UiOptionPickerOption {
  label: string
  value: string
  icon?: VNode
}

interface UiOptionPickerProps {
  options: UiOptionPickerOption[]
  compactIcon: UiIconName
  width?: number
  align?: UiPopoverAlign
  indent?: number
}

const props = withDefaults(defineProps<UiOptionPickerProps>(), {
  width: 265,
  align: "end",
  indent: 10,
})

const open = ref(false)
const model = defineModel<string>()

const selectedOption = computed(() => {
  return props.options.find(option => option.value === model.value)
})

function handleOptionSelect(option: UiOptionPickerOption) {
  model.value = option.value
  open.value = false
}
</script>

<template>
  <UiPopover
    v-model="open"
    as-child
    :align="props.align"
    :width="props.width"
    :content-spacing="0"
    :indent="props.indent"
  >
    <template #trigger>
      <UiButton
        :class="$style.trigger"
        variant="boxed"
        scheme="medium-gray"
        with-icon
      >
        <div :class="$style.triggerPc">
          <component
            :is="selectedOption?.icon"
            v-if="selectedOption?.icon"
          />
          {{ selectedOption?.label }}
        </div>
        <div :class="$style.triggerMobile">
          <UiIcon
            :name="props.compactIcon"
            :size="20"
          />
        </div>
      </UiButton>
    </template>
    <template #content>
      <template
        v-for="(option, index) in props.options"
        :key="option.value"
      >
        <UiButton
          variant="text"
          :class="$style.option"
          with-icon
          @click="handleOptionSelect(option)"
        >
          <component
            :is="option.icon"
            v-if="option.icon"
          />
          {{ option.label }}
        </UiButton>
        <UiDivider
          v-if="index < props.options.length - 1"
        />
      </template>
    </template>
  </UiPopover>
</template>

<style module lang="scss">
@use "~/shared/styles/mixins" as *;
@use "~/shared/styles/breakpoints" as *;

.trigger {
  border-radius: var(--s-border-radius-super-mega-huge);
  font-size: var(--fs-label-small);
  width: max-content;

  & > div {
    display: inherit;
    gap: inherit;
    align-items: inherit;
  }

  .triggerMobile {
    display: none;
  }

  @include mobilePlusDevice() {
    .triggerPc {
      display: none;
    }

    .triggerMobile {
      display: flex;
    }
  }
}

.option {
  padding: 8px 10px;
  gap: 8px;
  width: 100%;
  font-size: var(--fs-label-small);
  justify-content: flex-start;

  &:focus,
  &:active,
  &:hover {
    background: var(--c-white-05);
  }
}
</style>
