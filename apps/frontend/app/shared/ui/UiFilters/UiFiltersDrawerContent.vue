<script setup lang="ts" generic="TConfig extends UiFilterConfig[]">
import type {
  UiDateRangeFilterValue,
  UiFilterConfig,
  UiFiltersFallbackModel,
  UiFiltersModel,
  UiFiltersModelValue,
  UiMultiSelectFilterValue,
  UiRangeFilterValue,
  UiSingleSelectFilterValue,
} from "~/shared/ui/UiFilters"
import { onBeforeUnmount, ref, toRaw } from "vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiDivider } from "~/shared/ui/UiDivider"
import UiFilterDrawerCheckboxList from "~/shared/ui/UiFilters/UiFilterDrawerCheckboxList.vue"
import { UiRadioCheckboxList } from "~/shared/ui/UiRadioCheckboxList"
import { UiRangeSlider } from "~/shared/ui/UiRangeSlider"
import { UiTag } from "~/shared/ui/UiTag"
import { UiTypography } from "~/shared/ui/UiTypography"
import { UiYearRangePicker } from "~/shared/ui/UiYearRangePicker"
import { getFilterDefaultValue } from "./model/getFilterDefaultValue"

interface UiFiltersDrawerContentProps {
  config: TConfig
  resetLabel: string
}

const props = defineProps<UiFiltersDrawerContentProps>()
const model = defineModel<UiFiltersModel<TConfig>>({ required: true })

function cloneValue(value: UiFiltersModelValue): UiFiltersModelValue {
  if (!Array.isArray(value)) {
    return value
  }

  return structuredClone(toRaw(value))
}

function cloneModel(): UiFiltersFallbackModel {
  return Object.fromEntries(props.config.map(filter => [filter.id, cloneValue(model.value[filter.id])]))
}

const draftModel = ref<UiFiltersFallbackModel>(cloneModel())

function applyDraft() {
  const targetModel: UiFiltersFallbackModel = model.value
  for (const filter of props.config) {
    targetModel[filter.id] = cloneValue(draftModel.value[filter.id])
  }
}

function resetDraft() {
  draftModel.value = Object.fromEntries(props.config.map(filter => [filter.id, getFilterDefaultValue(filter)]))
}

function toggleTag(filterId: string, selectedValues: UiMultiSelectFilterValue, value: UiMultiSelectFilterValue[number]) {
  draftModel.value[filterId] = selectedValues.includes(value)
    ? selectedValues.filter(selectedValue => selectedValue !== value)
    : [...selectedValues, value]
}

onBeforeUnmount(() => {
  applyDraft()
})
</script>

<template>
  <div :class="$style.content">
    <template
      v-for="filter in props.config"
      :key="filter.id"
    >
      <section>
        <UiTypography
          :class="$style.sectionTitle"
          variant="labelSmall"
        >
          {{ filter.title }}
        </UiTypography>

        <UiFilterDrawerCheckboxList
          v-if="filter.type === 'multiSelect' && filter.drawerVariant === 'checkbox'"
          v-model="draftModel[filter.id] as UiMultiSelectFilterValue"
          :options="filter.options"
        />
        <div
          v-else-if="filter.type === 'multiSelect' && filter.drawerVariant === 'tag'"
          :class="$style.tags"
        >
          <UiTag
            v-for="option in filter.options"
            :key="option.value"
            as="button"
            type="button"
            text-variant="labelSmall"
            :color="(draftModel[filter.id] as UiMultiSelectFilterValue).includes(option.value) ? 'blue' : 'gray'"
            @click="toggleTag(filter.id, draftModel[filter.id] as UiMultiSelectFilterValue, option.value)"
          >
            {{ option.label }}
          </UiTag>
        </div>
        <UiRadioCheckboxList
          v-else-if="filter.type === 'singleSelect'"
          v-model="draftModel[filter.id] as UiSingleSelectFilterValue"
          :name="filter.id"
          :options="filter.options"
        />
        <UiRangeSlider
          v-else-if="filter.type === 'range'"
          v-model="draftModel[filter.id] as UiRangeFilterValue"
          :min="filter.min"
          :max="filter.max"
          :step="filter.step"
          :min-label="filter.minLabel"
          :max-label="filter.maxLabel"
          :get-label="filter.getLabel"
        />
        <UiYearRangePicker
          v-else-if="filter.type === 'dateRange'"
          v-model="draftModel[filter.id] as UiDateRangeFilterValue"
          :from-label="filter.fromLabel"
          :to-label="filter.toLabel"
          :min-year="filter.minYear"
          :max-year="filter.maxYear"
          :shortcuts="filter.shortcuts"
        />
      </section>

      <UiDivider />
    </template>

    <UiButton
      :class="$style.resetButton"
      variant="boxed"
      scheme="medium-gray"
      @click="resetDraft"
    >
      {{ props.resetLabel }}
    </UiButton>
  </div>
</template>

<style module lang="scss">
.content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sectionTitle {
  margin-bottom: 10px;
  font-weight: var(--fw-semi-bold);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  row-gap: 6px;
}

.resetButton {
  width: 100%;
}
</style>
