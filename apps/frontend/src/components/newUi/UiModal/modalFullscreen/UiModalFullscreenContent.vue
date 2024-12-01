<script setup lang="ts">
import { useModalContent } from "~/components/newUi/UiModal/useModalContent"

export interface UiModalFullscreenContentProps {
  indentTop?: number
}

export interface UiModalContentEmits {
  (event: "handleClose"): void;
}

const props = defineProps<UiModalFullscreenContentProps>()
const emits = defineEmits<UiModalContentEmits>();
const { handleCloseModal, bodyRef } = useModalContent(() => emits("handleClose"));

</script>

<template>
  <div
    :class="$style.wrapper"
    :style="{
      '--indent-top': `${props.indentTop || 0}px`
    }"
    @keydown.esc.stop="handleCloseModal"
  >
    <div
      ref="bodyRef"
      :class="$style.body"
    >
      <slot />
    </div>
  </div>
</template>

<style module lang="scss">
.wrapper {
  position: fixed;
  top: var(--indent-top);
  left: 0;
  width: 100%;
  height: calc(100vh - var(--indent-top));
  z-index: var(--i-modal-fullcreen);
  background: var(--c-main-background);

  .body {
    width: 100%;
    height: 100%;
  }
}
</style>
