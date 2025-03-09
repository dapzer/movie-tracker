<script setup lang="ts">
import { ref } from "vue"
import UiCheckbox from "~/shared/ui/UiCheckbox/UiCheckbox.vue"

const disabled = ref(false)
const checked = ref(false)
</script>

<template>
  <Story
    group="ui-kit"
    title="UiCheckbox"
  >
    <template #default>
      <UiCheckbox
        v-model="checked"
        :disabled="disabled"
      />
    </template>

    <template #controls>
      <HstCheckbox
        v-model="checked"
        title="Checked"
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
