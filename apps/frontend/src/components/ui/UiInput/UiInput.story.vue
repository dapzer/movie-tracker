<script setup lang="ts">

import { UiInput } from "~/components/ui/UiInput"
import { ref } from "vue"
import type { UiInputSize } from "~/components/ui/UiInput/UiInput.vue"
import { SearchIcon } from "~/components/ui/icons"

const disabled = ref(false)
const placeholder = ref<string>("Placeholder")
const value = ref<string>("Value")
const error = ref<string>("Some input error")
const size = ref<UiInputSize>("default")

const sizes = [{
  label: "Default",
  value: "default"
},{
  label: "Small",
  value: "small"
}]
</script>

<template>
  <Story
    group="ui-kit"
    title="UiInput"
  >
    <template #default>
      <Variant title="Empty">
        <UiInput
          :size="size"
          :placeholder="placeholder"
          :disabled="disabled"
        />
      </Variant>
      <Variant title="WithValue">
        <UiInput
          v-model="value"
          :size="size"
          :placeholder="placeholder"
          :disabled="disabled"
        />
      </Variant>
      <Variant title="WithIcon">
        <UiInput
          v-model="value"
          :size="size"
          :placeholder="placeholder"
          :disabled="disabled"
        >
          <template #icon>
            <SearchIcon />
          </template>
        </UiInput>
      </Variant>
      <Variant title="WithError">
        <UiInput
          v-model="value"
          :size="size"
          :error="error"
          :placeholder="placeholder"
          :disabled="disabled"
        />
      </Variant>
    </template>

    <template #controls>
      <HstText
        v-model="value"
        title="Value"
      />
      <HstText
        v-model="placeholder"
        title="Placeholder"
      />
      <HstSelect
        v-model="size"
        title="Size"
        :options="sizes"
      />
      <HstText
        v-model="error"
        title="Error"
      />
      <HstCheckbox
        v-model="disabled"
        title="Disabled"
      />
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
