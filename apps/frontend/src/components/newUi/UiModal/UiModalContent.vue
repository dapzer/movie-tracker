<script setup lang="ts">
import { onMounted, onUnmounted } from "#imports"
import { ref, type VNodeRef } from "vue"
import UiContainer from "~/components/ui/UiContainer.vue"
import { UiButton } from "~/components/newUi/UiButton"
import { CrossIcon } from "~/components/ui/icons"
import { UiTypography } from "~/components/newUi/UiTypography"

export interface UiModalProps {
  maxWidth?: number
  title: string
}

export interface UiModalContentEmits {
  (event: "handleClose"): void;
}

const props = defineProps<UiModalProps>()
const emits = defineEmits<UiModalContentEmits>();
const bodyRef = ref<VNodeRef | null>(null);

const closeModalOnKeypress = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emits("handleClose");
  }
}

onMounted(() => {
  document.addEventListener('keydown', closeModalOnKeypress);
  document.body.style.overflow = 'hidden';
  console.log(bodyRef.value)
  if (bodyRef.value) {
    bodyRef.value.focus();
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', closeModalOnKeypress);
  document.body.style.overflow = '';
});
</script>

<template>
  <div
    :class="$style.wrapper"
    @click="emits('handleClose')"
  >
    <UiContainer>
      <div
        ref="bodyRef"
        tabindex="0"
        :class="[$style.body]"
        :style="{
          '--max-width': props.maxWidth ? `${props.maxWidth}px` : 'unset'
        }"
        @click.stop
      >
        <div :class="$style.header">
          <UiTypography variant="title4">
            {{ props.title }}
          </UiTypography>
          <UiButton
            :class="$style.closeButton"
            variant="text"
            @click="emits('handleClose')"
          >
            <CrossIcon />
          </UiButton>
        </div>

        <div :class="$style.content">
          <slot />
        </div>
      </div>
    </UiContainer>
  </div>
</template>

<style module lang="scss">
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  background: var(--c-black-90);
  z-index: var(--i-moda);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .body {
    margin: 0 auto;
    position: relative;
    outline: none;
    background: var(--c-card-background-hovered);
    border-radius: var(--s-border-radius-huge);
    max-height: 90vh;
    overflow-y: auto;
    width: 100%;
    max-width: var(--max-width);

    .header {
      padding: 24px;
      position: sticky;
      top: 0;
      background: var(--c-card-background-hovered);

      .closeButton {
        position: absolute;
        top: 14px;
        right: 14px;
        padding: 4px;
        line-height: 0;

        &:active,
        &:focus,
        &:hover {
          border-radius: var(--s-border-radius-medium);
          background: var(--c-stroke);
        }
      }
    }

    .content {
      padding: 24px;
      padding-top: 0;
    }
  }
}
</style>
