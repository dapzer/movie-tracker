<script setup lang="ts">
import UiModalContent from "~/shared/ui/UiModal/modal/UiModalContent.vue"
import UiModalCore from "~/shared/ui/UiModal/UiModalCore.vue"

export interface UiModalProps {
  maxWidth?: number
  title: string
  description?: string
}

const props = defineProps<UiModalProps>()
const model = defineModel<boolean>()
</script>

<template>
  <UiModalCore v-model="model">
    <template #trigger="{ openModal }">
      <slot
        name="trigger"
        :open-modal="openModal"
      />
    </template>

    <template #content="{ closeModal }">
      <UiModalContent
        :max-width="props.maxWidth"
        :title="props.title"
        :description="props.description"
        @handle-close="closeModal"
      >
        <slot
          name="content"
          :close-modal="closeModal"
        />
        <template #afterTitle>
          <slot name="afterTitle" />
        </template>
      </UiModalContent>
    </template>
  </UiModalCore>
</template>

<style module lang="scss">
</style>
