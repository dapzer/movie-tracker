<script setup lang="ts">
import { ref } from "vue"

const model = defineModel<boolean>()
const slots = defineSlots()
const visible = ref(model)

const handleVisible = (value: boolean) => {
  visible.value = value
}
</script>

<template>
  <template
    v-if="slots.trigger"
  >
    <slot
      name="trigger"
      :openModal="() => handleVisible(true)"
    />
  </template>
  <Teleport
    v-if="visible"
    to="body"
  >
    <slot
      name="content"
      :closeModal="() => handleVisible(false)"
    />
  </Teleport>
</template>

<style module lang="scss">
</style>
