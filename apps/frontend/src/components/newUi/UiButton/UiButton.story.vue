<script setup lang="ts">

import UiButton, {
  type UiButtonScheme,
  type UiButtonSize,
  type UiButtonVariant
} from "~/components/newUi/UiButton/UiButton.vue"
import { ref } from "vue"
import { ArrowRightIcon, EyeIcon } from "~/components/ui/icons"

interface Option {
  value: string
  label: string
}

const disabled = ref(false)
const typeOptions = (["default", "boxed", "outlined", "text", "icon"] as UiButtonVariant[]).map((el) => {
  return {
    value: el,
    label: el,
  }
})
const type = ref<UiButtonVariant>("boxed")
const sizeOptions: Option[] = (["small", "medium", "large"] as UiButtonSize[]).map((el) => {
  return {
    value: el,
    label: el,
  }
})
const size = ref<UiButtonSize>("medium")
const schemeOptions: Option[] = (["default", "primary", "secondary", "tertiary", 'link'] as UiButtonScheme[]).map((el) => {
  return {
    value: el,
    label: el,
  }
})
const schema = ref<UiButtonScheme>("primary")
</script>

<template>
  <Story
    group="ui-kit"
    title="UiButton"
  >
    <template #default>
      <Variant title="Basic">
        <UiButton
          :variant="type"
          :scheme="schema"
          :size="size"
          :disabled="disabled"
        >
          Button
        </UiButton>
      </Variant>
      <Variant title="Icon">
        <UiButton
          variant="icon"
          :scheme="schema"
          :size="size"
          :disabled="disabled"
        >
          <EyeIcon />
        </UiButton>
      </variant>

      <Variant title="Rounded">
        <UiButton
          variant="rounded"
          :scheme="schema"
          :size="size"
          :disabled="disabled"
        >
          <ArrowRightIcon />
        </UiButton>
      </Variant>
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
