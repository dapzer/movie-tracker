<script setup lang="ts">
import { ref } from "vue"

const slots = defineSlots()
const model = defineModel<boolean>()
const visible = ref(model)

function handleVisible(value: boolean) {
  visible.value = value
}
</script>

<template>
  <template
    v-if="slots.trigger"
  >
    <slot
      name="trigger"
      :open-modal="() => handleVisible(true)"
    />
  </template>
  <Teleport
    v-if="visible"
    to="body"
  >
    <slot
      name="content"
      :close-modal="() => handleVisible(false)"
    />
  </Teleport>
</template>

<style module lang="scss">
</style>
