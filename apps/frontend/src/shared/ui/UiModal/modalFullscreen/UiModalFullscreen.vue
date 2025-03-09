<script setup lang="ts">
import type { UiModalFullscreenContentProps } from "~/shared/ui/UiModal/modalFullscreen/UiModalFullscreenContent.vue"
import UiModalFullscreenContent from "~/shared/ui/UiModal/modalFullscreen/UiModalFullscreenContent.vue"
import UiModalCore from "~/shared/ui/UiModal/UiModalCore.vue"

type UiModalFullscreenProps = UiModalFullscreenContentProps

const props = defineProps<UiModalFullscreenProps>()
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
      <UiModalFullscreenContent
        :indent-top="props.indentTop"
        @handle-close="closeModal"
      >
        <slot
          name="content"
          :close-modal="closeModal"
        />
      </UiModalFullscreenContent>
    </template>
  </UiModalCore>
</template>

<style scoped lang="scss">

</style>
