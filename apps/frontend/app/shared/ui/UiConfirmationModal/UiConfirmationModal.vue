<script setup lang="ts">
import { UiButton } from "~/shared/ui/UiButton"
import { UiModal } from "~/shared/ui/UiModal"

type UiConfirmationModalScheme = "danger"
interface UiConfirmationModalProps {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  scheme?: UiConfirmationModalScheme
}

const props = defineProps<UiConfirmationModalProps>()
const emit = defineEmits<{
  (event: "cancel"): void
  (event: "confirm"): void
}>()
const slots = defineSlots()
const model = defineModel<boolean>()

function handleCancel() {
  emit("cancel")
  model.value = false
}

function handleConfirm() {
  emit("confirm")
  model.value = false
}
</script>

<template>
  <UiModal
    v-model="model"
    :title="props.title"
    :description="props.description"
    :max-width="425"
  >
    <template
      v-if="slots.trigger"
      #trigger="{ openModal }"
    >
      <slot
        name="trigger"
        :open-modal="openModal"
      />
    </template>

    <template #content>
      <div :class="$style.content">
        <UiButton
          variant="outlined"
          @click="handleCancel"
        >
          {{ props.cancelText || $t("ui.actions.cancel") }}
        </UiButton>
        <UiButton
          :scheme="props.scheme === 'danger' ? 'tertiary' : undefined"
          @click="handleConfirm"
        >
          {{ props.confirmText || $t("ui.actions.confirm") }}
        </UiButton>
      </div>
    </template>
  </UiModal>
</template>

<style module lang="scss">
.content {
  display: flex;
  align-items: center;
  gap: 12px;

  button {
    width: 100%;
  }
}
</style>
