<script setup lang="ts">

import { UiTypography } from "~/shared/ui/UiTypography"
import { UiCheckbox } from "~/shared/ui/UiCheckbox"

interface UiFormListItemProps {
  title: string
  description: string
  radio?: boolean
}

const props = defineProps<UiFormListItemProps>()
const model = defineModel()

defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <label :class="$style.wrapper">
    <div>
      <UiCheckbox
        v-bind="$attrs"
        v-model="model"
        :radio="props.radio"
      />
      <UiTypography variant="label">
        {{ props.title }}
      </UiTypography>
    </div>
    <div>
      <UiTypography variant="description">
        {{ props.description }}
      </UiTypography>
      <slot name="rightContent" />
    </div>
  </label>
</template>

<style module lang="scss">
@import "~/styles/mixins";

.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  gap: 16px;
  min-width: 0;
  border-radius: var(--s-border-radius-medium);
  outline: none;

  p {
    @include ellipsisText();
  }

  &:active,
  &:focus,
  &:has(input:focus),
  &:has(input:active),
  &:hover {
    background-color: var(--c-white-05);
    cursor: pointer;
  }

  div {
    display: flex;
    gap: 10px;
    align-items: center;
    min-width: 0;
  }
}
</style>
