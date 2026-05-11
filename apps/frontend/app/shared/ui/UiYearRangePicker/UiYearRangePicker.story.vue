<script setup lang="ts">
import { ref } from "vue"
import UiYearRangePicker from "~/shared/ui/UiYearRangePicker/UiYearRangePicker.vue"

const value = ref<[number, number]>([2000, 2010])
const shortcuts = [2020, 2010, 2000, 1990, 1980, 1970, 1960, 1950]
</script>

<template>
  <Story
    group="ui-kit"
    title="UiYearRangePicker"
  >
    <template #default>
      <Variant title="Default">
        <div style="width: 280px; padding: 16px;">
          <UiYearRangePicker
            v-model="value"
            :shortcuts="shortcuts"
            :max-year="2050"
            :min-year="1500"
            from-label="From"
            to-label="to"
          />
          <p style="margin-top: 12px; color: var(--c-white-50); font-family: var(--ff-inter); font-size: 14px;">
            Range: {{ value[0] }} – {{ value[1] }}
          </p>
        </div>
      </Variant>
    </template>
  </Story>
</template>
