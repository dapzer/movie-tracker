<script setup lang="ts">
import {
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger
} from 'vaul-vue'
import { UiButton } from "~/components/newUi/UiButton"
import { CrossIcon } from "~/components/ui/icons"
import { UiTypography } from "~/components/newUi/UiTypography"

interface UiBottomDrawerProps {
  title: string
}

const props = defineProps<UiBottomDrawerProps>()
const model = defineModel<boolean>()
</script>

<template>
  <DrawerRoot
    ref="drawerRef"
    v-model:open="model"
  >
    <DrawerTrigger as="div">
      <slot name="trigger" />
    </DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay :class="$style.overlay" />
      <DrawerContent
        :class="$style.contentWrapper"
      >
        <div :class="$style.swipeTrigger" />

        <DrawerClose
          :class="$style.closeButton"
          :as="UiButton"
          variant="icon"
          scheme="primary"
          size="small"
        >
          <CrossIcon />
        </DrawerClose>

        <DrawerTitle
          :class="$style.title"
          :as="UiTypography"
          variant="title4"
        >
          {{ props.title }}
        </DrawerTitle>

        <div :class="$style.content">
          <slot name="content" />
        </div>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>

<style module lang="scss">
@import "~/styles/mixins";

.overlay {
  background: var(--c-black-90);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
}

.contentWrapper {
  width: 100%;
  position: fixed;
  max-height: calc(100% - 208px);
  height: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--c-card-background-hovered);
  border-top-left-radius: var(--s-border-radius-huge);
  border-top-right-radius: var(--s-border-radius-huge);
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .closeButton {
    position: absolute;
    right: 16px;
    top: 16px;
    background: var(--c-white-08);
    border: none;

    svg {
      width: 8px;
    }
  }

  .title {
    padding: 0 24px;
    text-align: center;
  }

  .content {
    height: 100%;
    overflow: auto;
  }

  .swipeTrigger {
    position: absolute;
    width: 36px;
    height: 4px;
    background: var(--c-white-15);
    left: 0;
    margin: 0 auto;
    right: 0;
    top: 6px;
  }
}
</style>
