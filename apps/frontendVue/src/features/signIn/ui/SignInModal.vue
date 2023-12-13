<script lang="ts" setup>

import UiModal from "~/components/ui/UiModal/UiModal.vue";
import type { ButtonVariant } from "~/components/ui/UiButton.vue";
import UiButton from "~/components/ui/UiButton.vue";
import { signInMethods } from "~/features/signIn/model/signInMethods";
import { useSignInApi } from "~/composables/useAuthApi";
import { spawnWindowInScreenCenter } from "~/utils/spawnWindowInScreenCenter";
import { ref } from "vue";
import { useQueryClient } from "@tanstack/vue-query";
import { AuthQueryKeys } from "~/constants/queryKeys";

interface LoginModalProps {
  isHideTrigger?: boolean;
  externalOpenedState?: boolean;
  btnTitle?: string;
  buttonVariant?: ButtonVariant;
}

const props = defineProps<LoginModalProps>();
const emits = defineEmits<{
  (event: "additionalHandler", currentVisibleState: boolean): void;
}>();

const isModalVisible = ref(props.externalOpenedState);

const { mutateAsync } = useSignInApi();
const queryClient = useQueryClient();

const onSignIn = async (provider: string) => {
  const response = await mutateAsync(provider);

  if (response) {
    const win = spawnWindowInScreenCenter(response, "Movie Tracker Sign In", window, 800, 600);
    win?.focus();
    const interval = setInterval(() => {
      if (win?.closed) {
        handleVisible(false);
        queryClient.invalidateQueries({ queryKey: [AuthQueryKeys.USER_PROFILE] });
        clearInterval(interval);
      }
    }, 1000);
  }
};

const handleVisible = (value: boolean) => {
  emits("additionalHandler", value);
  isModalVisible.value = value;
};
</script>

<template>
  <UiModal
    :btnTitle="props.btnTitle || $t('auth.signIn')"
    :buttonVariant="props.buttonVariant"
    :externalOpenedState="isModalVisible"
    :isHideTrigger="props.isHideTrigger"
    :maxWidth="350"
    :title="$t('auth.signIn')"
    isFullWidth
    v-bind="$attrs"
    @additionalHandler="handleVisible"
  >
    <div :class="$style.wrapper">
      <UiButton
        v-for="method in signInMethods"
        :key="method.title"
        :style="{ '--bg': method.color }"
        @click="onSignIn(method.provider)"
      >
        {{ method.title }}
      </UiButton>
    </div>
  </UiModal>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;

  button {
    width: 100%;
    font-size: var(--fs-h3);
    padding: 20px 10px;
    text-align: center;
    display: flex;
    justify-content: center;
    text-decoration: none;
    background: var(--bg);
    border-radius: unset;

    &:hover {
      color: var(--c-secondary) !important;
    }

    &:first-of-type {
      border-radius: var(--s-border-radius) var(--s-border-radius) 0 0;
    }

    &:last-of-type {
      border-radius: 0 0 var(--s-border-radius) var(--s-border-radius);
    }
  }
}
</style>
