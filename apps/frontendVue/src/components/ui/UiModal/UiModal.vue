<script lang="ts" setup>

import { ref } from "vue";
import type { ButtonVariant } from "~/components/ui/UiButton.vue";
import UiButton from "~/components/ui/UiButton.vue";
import UiModalContent from "~/components/ui/UiModal/UiModalContent.vue";
import { watch } from "#imports";

interface UiModalProps {
  title: string;
  maxWidth?: number;
  isFullWidth?: boolean;
  buttonVariant?: ButtonVariant;
  isHideTrigger?: boolean;
  externalOpenedState?: boolean;
}

const emits = defineEmits<{
  (event: "additionalHandler", currentVisibleState: boolean): void;
}>();

const props = defineProps<UiModalProps>();

const isModalVisible = ref<boolean>(props.externalOpenedState);

watch(
  () => props.externalOpenedState,
  (newValue) => {
    isModalVisible.value = newValue;
  }
);


const handleVisible = (value: boolean) => {
  isModalVisible.value = value;
  emits("additionalHandler", value);
};
</script>

<template>
  <UiButton
    v-if="!isHideTrigger"
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
      <slot name="content" />
    </UiModalContent>
  </Teleport>
</template>

<style lang="scss" module>
</style>
