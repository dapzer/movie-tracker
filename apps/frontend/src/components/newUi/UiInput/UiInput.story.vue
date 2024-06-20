<script setup lang="ts">

import { UiInput } from "~/components/newUi/UiInput"
import { ref } from "vue"

const disabled = ref(false)
const placeholder = ref<string>("Placeholder")
const value = ref<string>("Value")
const error = ref<string>("Some input error")
</script>

<template>
  <Story title="UiInput">
    <template #default>
      <Variant title="Empty">
        <UiInput
          :placeholder="placeholder"
          :disabled="disabled"
        />
      </Variant>
      <Variant title="WithValue">
        <UiInput
          v-model="value"
          :placeholder="placeholder"
          :disabled="disabled"
        />
      </Variant>
      <Variant title="WithError">
        <UiInput
          v-model="value"
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
