<script setup lang="ts">
import type { UiFilterOption, UiMultiSelectFilterValue } from "~/shared/ui/UiFilters/model/types.ts"
import { UiCheckbox } from "~/shared/ui/UiCheckbox"
import { UiTypography } from "~/shared/ui/UiTypography"

interface UiFilterDrawerCheckboxListProps {
  options: Array<UiFilterOption<string>>
}

const props = defineProps<UiFilterDrawerCheckboxListProps>()
const model = defineModel<UiMultiSelectFilterValue>({ default: () => [] })
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
        variant="square"
        :value="option.value"
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
  gap: 8px;

  .item {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 20px;

    &:active,
    &:focus,
    &:has(input:focus),
    &:has(input:active),
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
