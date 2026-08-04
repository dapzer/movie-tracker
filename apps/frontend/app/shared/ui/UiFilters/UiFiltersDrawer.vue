<script setup lang="ts" generic="TConfig extends UiFilterConfig[]">
import type { UiFilterConfig, UiFiltersModel, UiFiltersModelValue } from "./model/types"
import { computed, ref } from "vue"
import { UiBottomDrawer } from "~/shared/ui/UiBottomDrawer"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"
import { getFilterDefaultValue } from "./model/getFilterDefaultValue.ts"
import UiFiltersDrawerContent from "./UiFiltersDrawerContent.vue"

interface UiFiltersDrawerProps {
  config: TConfig
  title: string
  resetLabel: string
}

const props = defineProps<UiFiltersDrawerProps>()
const model = defineModel<UiFiltersModel<TConfig>>({ required: true })
const isDrawerOpen = ref(false)

function valuesMatch(value: UiFiltersModelValue, defaultValue: UiFiltersModelValue): boolean {
  if (Array.isArray(value) && Array.isArray(defaultValue)) {
    return value.length === defaultValue.length && value.every((item, index) => item === defaultValue[index])
  }

  return value === defaultValue
}

const isActive = computed(() => {
  return props.config.some((filter) => {
    return !valuesMatch(model.value[filter.id], getFilterDefaultValue(filter))
  })
})
</script>

<template>
  <UiButton
    :class="$style.trigger"
    :aria-label="props.title"
    variant="boxed"
    :scheme="isActive ? 'secondary-light' : 'medium-gray'"
    with-icon
    @click="isDrawerOpen = true"
  >
    <UiIcon
      name="icon:filter"
      :size="20"
    />
  </UiButton>

  <UiBottomDrawer
    v-model="isDrawerOpen"
    :title="props.title"
  >
    <template #content>
      <UiFiltersDrawerContent
        v-if="isDrawerOpen"
        v-model="model"
        :config="props.config"
        :reset-label="props.resetLabel"
      />
    </template>
  </UiBottomDrawer>
</template>

<style module lang="scss">
.trigger {
  width: 100%;
  justify-content: center;
  border-radius: var(--s-border-radius-super-mega-huge);
  font-size: var(--fs-label-small);
}
</style>
