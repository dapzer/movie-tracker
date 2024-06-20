<script setup lang="ts">

import UiButton, {
  type UiButtonScheme,
  type UiButtonSize,
  type UiButtonType
} from "~/components/newUi/UiButton/UiButton.vue"
import { ref } from "vue"

interface Option {
  value: string
  label: string
}

const disabled = ref(false)
const typeOptions = (["boxed", "outlined", "text"] as UiButtonType[]).map((el) => {
  return {
    value: el,
    label: el,
  }
})
const type = ref<UiButtonType>("boxed")
const sizeOptions: Option[] = (["small", "medium", "large"] as UiButtonSize[]).map((el) => {
  return {
    value: el,
    label: el,
  }
})
const size = ref<UiButtonSize>("medium")
const schemeOptions: Option[] = (["primary", "secondary", "tertiary", 'link'] as UiButtonScheme[]).map((el) => {
  return {
    value: el,
    label: el,
  }
})
const schema = ref<UiButtonScheme>("primary")
</script>

<template>
  <Story title="UiButton">
    <template #default>
      <UiButton
        :type="type"
        :scheme="schema"
        :size="size"
        :disabled="disabled"
      >
        Button
      </UiButton>
    </template>

    <template #controls>
      <HstSelect
        v-model="type"
        title="Type"
        :options="typeOptions"
      />
      <HstSelect
        v-model="size"
        title="Size"
        :options="sizeOptions"
      />
      <HstSelect
        v-model="schema"
        title="Type"
        :options="schemeOptions"
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
