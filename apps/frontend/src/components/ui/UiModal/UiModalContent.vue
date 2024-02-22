<script lang="ts" setup>

import { computed, nextTick, onMounted, onUnmounted } from "#imports";
import { CloseIcon } from "~/components/ui/icons";
import UiTypography from "~/components/ui/UiTypography.vue";
import UiButton from "~/components/ui/UiButton.vue";
import UiContainer from "~/components/ui/UiContainer.vue";
import { ref, type VNodeRef } from "vue";

interface UiModaContentProps {
  title: string;
  maxWidth?: number;
  isFullWidth?: boolean;
}

const props = defineProps<UiModaContentProps>();
const emit = defineEmits<{
  (event: "handleClose"): void
}>();

const bodyRef = ref<VNodeRef | null>(null);

const bodyMaxWidth = computed(() => {
  if (props.maxWidth) {
    return `${props.maxWidth}px`;
  }
  return props.isFullWidth ? "100%" : "fit-content";
})

const closeModalOnKeypress = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit("handleClose");
  }
}

onMounted(() => {
  document.addEventListener('keydown', closeModalOnKeypress);
  document.body.style.overflow = 'hidden';
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
    @click="emit('handleClose')"
  >
    <UiContainer>
      <div
        ref="bodyRef"
        tabindex="0"
        :class="[$style.body, {
          [$style.body_fullWidth]: props.isFullWidth
        }]"
        @click.stop
      >
        <div :class="$style.header">
          <UiTypography variant="title2">
            {{ props.title }}
          </UiTypography>
          <UiButton
            variant="clear"
            @click="emit('handleClose')"
          >
            <CloseIcon width="24px" />
          </UiButton>
        </div>
        <div :class="$style.content">
          <slot />
        </div>
      </div>
    </UiContainer>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, .6);
  z-index: 1000;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .body {
    margin: 0 auto;
    background: var(--c-background);
    max-height: 90vh;
    overflow-y: auto;
    border-radius: var(--s-border-radius);
    padding-bottom: 20px;
    max-width: v-bind('bodyMaxWidth');

    &_fullWidth {
      width: 100% !important;
    }
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    position: sticky;
    top: 0;
    background: var(--c-background);
    z-index: 1000;
    padding-bottom: 20px;
    padding-top: 20px;
  }

  .header,
  .content {
    padding-right: 20px;
    padding-left: 20px;
  }
}
</style>
