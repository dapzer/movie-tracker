<script setup lang="ts">
import { ref } from "vue"
import { UiTextarea } from "~/components/newUi/UiTextarea"

const value = ref('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic')
const disabled = ref(false)
const placeholder = ref("Text")
const error = ref("")
const description = ref("")
</script>

<template>
  <Story
    group="ui-kit"
    title="UiTextarea"
  >
    <template #default>
      <UiTextarea
        v-model="value"
        :description="description"
        :placeholder="placeholder"
        :error="error"
        :disabled="disabled"
      />
    </template>

    <template #controls>
      <HstCheckbox
        v-model="disabled"
        title="Disabled"
      />
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
      <HstText
        v-model="description"
        title="Description"
      />
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
