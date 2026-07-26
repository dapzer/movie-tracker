<script setup lang="ts">
import { ref } from "vue"
import { UiCheckboxList } from "~/shared/ui/UiCheckboxList"

const stringOptions = [
  {
    label: "Action",
    value: "action",
  },
  {
    label: "Drama",
    value: "drama",
  },
  {
    label: "Comedy",
    value: "comedy",
  },
]

const numberOptions = [
  {
    label: "2024",
    value: "2024",
  },
  {
    label: "2025",
    value: "2025",
  },
  {
    label: "2026",
    value: "2026",
  },
]

const selectedStrings = ref<string[]>(["drama"])
const selectedNumbers = ref<string[]>(["2025"])
</script>

<template>
  <Story
    group="ui-kit"
    title="UiCheckboxList"
  >
    <template #default>
      <div :class="$style.wrapper">
        <Variant title="String values">
          <UiCheckboxList
            v-model="selectedStrings"
            :options="stringOptions"
          />
        </Variant>

        <Variant title="Numeric labels">
          <UiCheckboxList
            v-model="selectedNumbers"
            :options="numberOptions"
          />
        </Variant>
      </div>
    </template>
  </Story>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 265px;
}
</style>
