<script setup lang="ts">
import { UiModal } from "~/components/ui/UiModal"
import { UiButton } from "~/components/ui/UiButton"
import { ref } from "vue"

type UiConfirmationModalScheme =  'danger'
interface UiConfirmationModalProps {
  title: string;
  description?: string;
  confirmText?: string;
  scheme?: UiConfirmationModalScheme;
}

const props = defineProps<UiConfirmationModalProps>()
const emit = defineEmits<{
  (event: 'cancel'): void
  (event: 'confirm'): void
}>()
const model = defineModel<boolean>()
const slots = defineSlots()
const isOpen = ref(model.value ?? false)

const handleCancel = () => {
  emit('cancel')
  model.value = false
  isOpen.value = false
}

const handleConfirm = () => {
  emit('confirm')
  model.value = false
  isOpen.value = false
}

</script>

<template>
  <UiModal
    v-model="isOpen "
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
        :openModal="openModal"
      />
    </template>

    <template #content>
      <div :class="$style.content">
        <UiButton
          variant="outlined"
          @click="handleCancel"
        >
          {{ $t("ui.actions.cancel") }}
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
