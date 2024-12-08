<script setup lang="ts">

import { UiSwitch } from "~/components/ui/UiSwitch"
import { ref } from "vue"

const disabled = ref(false)
const checked = ref(false)
</script>

<template>
  <Story
    group="ui-kit"
    title="UiSwitch"
  >
    <template #default>
      <UiSwitch
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
