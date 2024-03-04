<script lang="ts" setup>

import { ref } from "vue";
import type { ButtonColorScheme, ButtonSize, ButtonVariant } from "~/components/ui/UiButton.vue";
import UiButton from "~/components/ui/UiButton.vue";
import UiModalContent from "~/components/ui/UiModal/UiModalContent.vue";
import { watch } from "#imports";

export interface UiModalProps {
  title: string;
  maxWidth?: number;
  isFullWidth?: boolean;
  buttonVariant?: ButtonVariant;
  buttonColorScheme?: ButtonColorScheme;
  isHideTrigger?: boolean;
  externalOpenedState?: boolean;
  buttonSize?: ButtonSize;
  loadingIndicatorThickness?: number;
  isLoading?: boolean;
}

export interface UiModalEmits {
  (event: "additionalHandler", currentVisibleState: boolean): void;
}

const props = withDefaults(defineProps<UiModalProps>(), {
  externalOpenedState: undefined
});
const emits = defineEmits<UiModalEmits>();

const isModalVisible = ref<boolean>(Boolean(props.externalOpenedState));

watch(
  () => props.externalOpenedState,
  (newValue) => {
    isModalVisible.value = Boolean(newValue);
  }
);


const handleVisible = (value: boolean) => {
  if (props.externalOpenedState === undefined) {
    isModalVisible.value = value;
  }
  emits("additionalHandler", value);
};

defineExpose({ handleVisible });
</script>

<template>
  <UiButton
    v-if="!isHideTrigger"
    :is-loading="props.isLoading"
    :loading-indicator-thickness="props.loadingIndicatorThickness"
    :color-scheme="props.buttonColorScheme"
    :size="props.buttonSize"
    :variant="props.buttonVariant ?? 'default'"
    v-bind="$attrs"
    @click="handleVisible(true)"
  >
    <slot name="trigger" />
  </UiButton>

  <Teleport
    v-if="isModalVisible"
    to="body"
  >
    <UiModalContent
      :isFullWidth="props.isFullWidth"
      :maxWidth="props.maxWidth"
      :title="props.title"
      @handle-close="handleVisible(false)"
    >
      <slot
        :closeModal="() => handleVisible(false)"
        name="content"
      />
    </UiModalContent>
  </Teleport>
</template>

<style lang="scss" module>
</style>
