<script setup lang="ts">
import UiModalCore from "~/components/newUi/UiModal/UiModalCore.vue"
import UiModalFullscreenContent, {
  type UiModalFullscreenContentProps
} from "~/components/newUi/UiModal/modalFullscreen/UiModalFullscreenContent.vue"

type UiModalFullscreenProps = UiModalFullscreenContentProps

const props = defineProps<UiModalFullscreenProps>()
const model = defineModel<boolean>()
</script>

<template>
  <UiModalCore v-model="model">
    <template #trigger="{openModal}">
      <slot
        name="trigger"
        :openModal="openModal"
      />
    </template>

    <template #content="{closeModal}">
      <UiModalFullscreenContent
        :indentTop="props.indentTop"
        @handle-close="closeModal"
      >
        <slot
          name="content"
          :closeModal="closeModal"
        />
      </UiModalFullscreenContent>
    </template>
  </UiModalCore>
</template>

<style scoped lang="scss">

</style>
