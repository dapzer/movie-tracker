<script lang="ts" setup>

import type { VNode } from "vue";
import { ref } from "vue";
import UiButton from "~/components/ui/UiButton.vue";
import type { ButtonVariant } from "~/components/ui/UiButton.vue";
import UiModalContent from "~/components/ui/UiModal/UiModalContent.vue";
import { watch } from "#imports";

interface UiModalProps {
  title: string;
  btnTitle?: string | VNode;
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
    {{ props.btnTitle }}
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
      <slot />
    </UiModalContent>
  </Teleport>
</template>

<style lang="scss" module>
</style>
