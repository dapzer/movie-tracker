<script setup lang="ts">
import { ref } from "vue"
import UiRangeSlider from "~/shared/ui/UiRangeSlider/UiRangeSlider.vue"
import { UiTypography } from "~/shared/ui/UiTypography"

const value = ref<[number, number]>([2, 8])
const min = ref(1)
const max = ref(10)
const step = ref(1)
</script>

<template>
  <Story
    group="ui-kit"
    title="UiRangeSlider"
  >
    <template #default>
      <Variant title="Default">
        <div style="max-width: 300px; padding: 16px;">
          <UiRangeSlider
            v-model="value"
            :min="min"
            :max="max"
            :step="step"
          />
          <UiTypography style="margin-top: 12px;">
            Value: {{ value[0] }} – {{ value[1] }}
          </UiTypography>
        </div>
      </Variant>
    </template>

    <template #controls>
      <HstNumber
        v-model="min"
        title="Min"
      />
      <HstNumber
        v-model="max"
        title="Max"
      />
      <HstNumber
        v-model="step"
        title="Step"
      />
    </template>
  </Story>
</template>
