<script setup lang="ts">
import type { VNodeRef } from "vue"
import { ComboboxAnchor, ComboboxInput, ComboboxRoot } from "radix-vue"
import { ref, watch } from "vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"

interface UiComboboxProps {
  width?: number
  indent?: number
  align?: "start" | "center" | "end"
  side?: "top" | "right" | "bottom" | "left"
  contentClass?: string
  placeholder?: string
}

const props = withDefaults(defineProps<UiComboboxProps>(), {
  indent: 0,
  align: "start",
})

const model = defineModel<string>()
const modelOpen = defineModel<boolean>("open")
const searchTerm = ref(model)
const open = ref(modelOpen)
const inputRef = ref<VNodeRef | null>(null)

watch(() => open.value, (value) => {
  if (!value) {
    inputRef.value.$el.blur()
  }
})
</script>

<template>
  <ComboboxRoot
    v-bind="$attrs"
    v-model:search-term="searchTerm"
    v-model:open="open"
    @update:search-term="value => searchTerm = value"
  >
    <ComboboxAnchor :class="$style.anchor">
      <UiIcon
        name="icon:search"
        :class="$style.searchIcon"
      />
      <ComboboxInput
        ref="inputRef"
        as="input"
        :placeholder="props.placeholder"
        :class="[$style.input, $style.small, $style.withIcon]"
      />
      <ComboboxCancel
        v-if="searchTerm"
        :class="$style.cancelButton"
        :as="UiButton"
        variant="text"
      >
        <UiIcon
          name="icon:close"
          :size="13.75"
        />
      </ComboboxCancel>
    </ComboboxAnchor>

    <ComboboxPortal>
      <ComboboxContent
        :class="$style.contentWrapper"
        :style="{
          '--width': props.width ? `${props.width}px` : 'var(--radix-combobox-trigger-width)',
        }"
        hide-when-detached
        position="popper"
        :collision-padding="24"
        :align="props.align"
        :side="props.side"
        :side-offset="props.indent"
      >
        <ComboboxViewport :class="[$style.content, props.contentClass]">
          <slot />
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";

.anchor {
  position: relative;

  .searchIcon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 10px;
    z-index: 1;
    width: 16px;
    height: 16px;
  }

  .cancelButton {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    z-index: 1;
    width: 20px;
    height: 20px;
    color: var(--c-white-50);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .input {
    @include input;

    &.small {
      padding-right: 34px;
    }
  }
}

.contentWrapper {
  z-index: var(--i-dropdown);
  background: var(--c-card-background);
  overflow: hidden;
  color: #fff;
  width: min(var(--radix-combobox-content-available-width), var(--width));
}

.content {
  display: flex;
  padding: 10px;
  flex-direction: column;
  gap: 8px;
  background: var(--c-card-background);
  max-height: var(--radix-combobox-content-available-height);
  overflow-y: auto;
  width: 100%;
  border-radius: var(--s-border-radius);
  @include scrollbar;

  &[data-radix-combobox-viewport]::-webkit-scrollbar {
    display: block;
  }

  &[data-radix-combobox-viewport] {
    scrollbar-width: inherit;
  }
}

.item {
  width: 100%;
}
</style>
