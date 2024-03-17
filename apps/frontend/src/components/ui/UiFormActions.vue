<script lang="ts" setup>

import UiButton from "~/components/ui/UiButton.vue";

interface UiFormActionsProps {
  isConfirmDisabled?: boolean;
  isCancelDisabled?: boolean;
  confirmText?: string
  cancelText?: string
}

const props = defineProps<UiFormActionsProps>();
const emits = defineEmits<{
  confirm: []
  cancel: []
}>();
</script>

<template>
  <div :class="$style.wrapper">
    <UiButton
      :disabled="props.isConfirmDisabled"
      color-scheme="success"
      @click="emits('confirm')"
    >
      {{ props.confirmText ?? $t("ui.actions.save") }}
    </UiButton>
    <UiButton
      :disabled="props.isCancelDisabled"
      color-scheme="danger"
      type="button"
      @click="emits('cancel')"
    >
      {{ props.cancelText ?? $t("ui.actions.cancel") }}
    </UiButton>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}
</style>
