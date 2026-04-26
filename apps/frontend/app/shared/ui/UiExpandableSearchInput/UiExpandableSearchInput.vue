<script setup lang="ts">
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"

defineOptions({
  inheritAttrs: false,
})
const model = defineModel<string>()

function handleClearButtonClick() {
  model.value = ""
}
</script>

<template>
  <label
    :class="[$style.wrapper, {
      [$style.active]: Boolean(model),
    }]"
  >
    <div :class="$style.icon">
      <UiIcon name="icon:search" />
    </div>
    <input
      v-model="model"
      v-bind="$attrs"
      type="text"
      :class="$style.input"
    >
    <UiButton
      v-if="Boolean(model)"
      variant="textIcon"
      :class="$style.clearButton"
      @click="handleClearButtonClick"
    >
      <UiIcon
        name="icon:close"
        :size="9.75"
      />
    </UiButton>
  </label>
</template>

<style module lang="scss">
.wrapper {
  position: relative;
  display: block;

  &:not(.active):not(:focus-within) {
    .input {
      padding: 0;
      width: 40px;

      &::placeholder {
        opacity: 0;
      }
    }
  }
  //
  //&:has(input:active),
  //&:has(input:focus),
  //&.active {
  //  width: 100%;
  //}
}

.icon {
  position: absolute;
  display: flex;
  top: 50%;
  transform: translateY(-50%);
  left: 12px;
  z-index: 1;
  pointer-events: none;
}

.input {
  width: 100%;
  height: 36px;
  color: var(--c-text);
  font-size: var(--fs-input-small);
  line-height: var(--lh-input);
  font-family: var(--ff-inter);
  padding-right: 34px;
  padding-left: 34px;
  border-radius: var(--s-border-radius-super-mega-huge);
  background-color: var(--c-white-10);
  border: unset;
  outline: none;
  transition: width 150ms ease;
}

.clearButton {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  z-index: 1;
  width: 16px;
  height: 16px;
  color: var(--c-white-50);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
