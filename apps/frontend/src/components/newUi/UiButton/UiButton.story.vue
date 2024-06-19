<script setup lang="ts">

import UiButton from "~/components/newUi/UiButton/UiButton.vue"
import { ref } from "vue"

const disabled = ref(false)
</script>

<template>
  <Story
    title="UiButton"
    :layout="{ type: 'grid', width: 150 }"
  >
    <template #default>
      <Variant title="Primary">
        <UiButton
          variant="primary"
          :disabled="disabled"
        >
          Button
        </UiButton>
      </Variant>

      <Variant title="Secondary">
        <UiButton
          variant="secondary"
          :disabled="disabled"
        >
          Button
        </UiButton>
      </variant>

      <Variant title="Tertiary">
        <UiButton
          variant="tertiary"
          :disabled="disabled"
        >
          Button
        </UiButton>
      </Variant>
    </template>

    <template #controls>
      <HstCheckbox
        v-model="disabled"
        title="Disabled"
      />
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
