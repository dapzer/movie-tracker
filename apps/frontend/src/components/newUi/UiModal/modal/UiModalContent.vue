<script setup lang="ts">
import { UiContainer } from "~/components/newUi/UiContainer"
import { UiButton } from "~/components/newUi/UiButton"
import { CrossIcon } from "~/components/ui/icons"
import { UiTypography } from "~/components/newUi/UiTypography"
import { useModalContent } from "~/components/newUi/UiModal/useModalContent"

export interface UiModalProps {
  maxWidth?: number
  title: string
  description?: string
}

export interface UiModalContentEmits {
  (event: "handleClose"): void;
}

const props = defineProps<UiModalProps>()
const emits = defineEmits<UiModalContentEmits>();
const { handleCloseModal, bodyRef } = useModalContent(() => emits("handleClose"));

</script>

<template>
  <div
    :class="$style.wrapper"
    @click="emits('handleClose')"
    @keydown.esc.stop="handleCloseModal"
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
          <UiTypography v-if="props.description">
            {{ props.description }}
          </UiTypography>
          <UiButton
            :class="$style.closeButton"
            variant="textIcon"
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
  z-index: var(--i-modal);
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
      display: flex;
      flex-direction: column;
      gap: 16px;

      p {
        color: var(--c-text-secondary);
      }

      .closeButton {
        position: absolute;
        top: 14px;
        right: 14px;
        padding: 4px;
        line-height: 0;

        svg {
          width: 12px;
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
