<script setup lang="ts">
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiButton } from "~/shared/ui/UiButton"
import { UiTypography } from "~/shared/ui/UiTypography"
import { useModalContent } from "~/shared/ui/UiModal/useModalContent"
import { UiIcon } from "~/shared/ui/UiIcon"

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
          <div :class="$style.titleWrapper">
            <UiTypography variant="title4">
              {{ props.title }}
            </UiTypography>
            <slot name="afterTitle" />
          </div>
          <UiTypography
            v-if="props.description"
            :class="$style.description"
          >
            {{ props.description }}
          </UiTypography>
          <UiButton
            :class="$style.closeButton"
            variant="textIcon"
            @click="emits('handleClose')"
          >
            <UiIcon
              name="icon:cross"
              :size="12"
            />
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
      padding-right: 40px;
      position: sticky;
      top: 0;
      background: var(--c-card-background-hovered);
      display: flex;
      flex-direction: column;
      gap: 16px;

      .titleWrapper {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .description {
        color: var(--c-text-secondary);
      }

      .closeButton {
        position: absolute;
        top: 14px;
        right: 14px;
        padding: 4px;
        line-height: 0;
      }
    }

    .content {
      padding: 24px;
      padding-top: 0;
    }
  }
}
</style>
