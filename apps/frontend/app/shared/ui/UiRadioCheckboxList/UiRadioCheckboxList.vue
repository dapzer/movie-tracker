<script setup lang="ts">
import { UiCheckbox } from "~/shared/ui/UiCheckbox"
import { UiTypography } from "~/shared/ui/UiTypography"

type Value = string | number

interface UiRadioCheckboxListProps {
  options: Array<{ value: Value, label: string | number }>
  name?: string
}

const props = defineProps<UiRadioCheckboxListProps>()
const model = defineModel<Value | undefined>()
</script>

<template>
  <div :class="$style.wrapper">
    <label
      v-for="option in props.options"
      :key="option.value"
      :class="$style.item"
    >
      <UiCheckbox
        v-model="model"
        radio
        variant="square"
        :value="option.value"
        :name="props.name"
        size="small"
      />
      <UiTypography
        as="span"
        variant="label"
      >
        {{ option.label }}
      </UiTypography>
    </label>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;

  .item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    height: 36px;

    &:active,
    &:focus,
    &:has(input:focus),
    &:has(input:active),
    &:hover {
      background-color: var(--c-white-05);
      cursor: pointer;
    }
  }

  .item:not(:last-child) {
    border-bottom: 1px solid var(--c-charcoal-50);
  }
}
</style>
