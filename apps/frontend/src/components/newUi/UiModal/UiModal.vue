<script setup lang="ts">
import UiModalContent from "~/components/newUi/UiModal/UiModalContent.vue"
import { computed, ref } from "vue"

export interface UiModalProps {
  maxWidth?: number
  title: string
}

const props = defineProps<UiModalProps>()
const model = defineModel<boolean>()

const visible = ref(model.value ?? false)

const visibleState = computed(() => {
  return model.value ?? visible
})

const handleVisible = (value: boolean) => {
  visible.value = value
  model.value = value
}

const slots = defineSlots()
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
    v-if="visibleState"
    to="body"
  >
    <UiModalContent
      :max-width="props.maxWidth"
      :title="props.title"
      @handle-close="handleVisible(false)"
    >
      <slot name="content" />
    </UiModalContent>
  </Teleport>
</template>

<style module lang="scss">
</style>
