<script lang="ts" setup>
import UiModal, { type UiModalEmits, type UiModalProps } from "~/components/ui/UiModal/UiModal.vue";
import UiTypography from "~/components/ui/UiTypography.vue";
import UiButton from "~/components/ui/UiButton.vue";

interface UiConfirmationModalProps extends UiModalProps {
  title: string;
  description?: string;
}

interface UiConfirmationModalEmits extends UiModalEmits {
  (event: "onConfirm"): void;
}

const props = withDefaults(defineProps<UiConfirmationModalProps>(), {
  externalOpenedState: undefined
});
const emits = defineEmits<UiConfirmationModalEmits>();

</script>

<template>
  <UiModal
    :button-color-scheme="props.buttonColorScheme"
    :button-variant="props.buttonVariant"
    :external-opened-state="props.externalOpenedState ?? undefined"
    :is-full-width="props.isFullWidth"
    :is-hide-trigger="props.isHideTrigger"
    :max-width="props.maxWidth"
    :title="$t('ui.confirmAction')"
    @additional-handler="emits('additionalHandler', $event)"
  >
    <template #trigger>
      <slot />
    </template>

    <template #content="{closeModal}">
      <div :class="$style.content">
        <UiTypography variant="title3">
          {{ title }}
        </UiTypography>
        <UiTypography>
          {{ description }}
        </UiTypography>

        <div :class="$style.controls">
          <UiButton
            color-scheme="success"
            @click="() => {
              emits('onConfirm')
              closeModal()
            }"
          >
            {{ $t('ui.yes') }}
          </UiButton>
          <UiButton
            color-scheme="danger"
            @click="closeModal"
          >
            {{ $t('ui.no') }}
          </UiButton>
        </div>
      </div>
    </template>
  </UiModal>
</template>

<style lang="scss" module>
.content {
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;

  p {
    text-align: center;
    word-break: break-word;
  }

  .controls {
    display: flex;
    gap: 8px;
    margin-top: 14px;
  }
}
</style>
