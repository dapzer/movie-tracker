<script lang="ts" setup>

import UiModal, { type UiModalProps } from "~/components/ui/UiModal/UiModal.vue";
import type { ButtonVariant } from "~/components/ui/UiButton.vue";
import UiButton from "~/components/ui/UiButton.vue";
import { signInMethods } from "~/features/signIn/model/signInMethods";
import { useSignInApi } from "~/composables/useAuthApi";
import { spawnWindowInScreenCenter } from "~/utils/spawnWindowInScreenCenter";
import { ref } from "vue";
import { useQueryClient } from "@tanstack/vue-query";
import { AuthQueryKeys, MediaItemQueryKeys, MediaListQueryKeys } from "~/constants/queryKeys";
import { getCurrentBrowserName } from "~/utils/getCurrentBrowserName";
import { BrowserEnum } from "~/types/browserEnum";
import { useLocalStorage } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useRoute } from "#app";

interface LoginModalProps extends Partial<Pick<UiModalProps, "buttonVariant" | "buttonColorScheme" | "externalOpenedState"
  | "isHideTrigger">> {
  btnTitle?: string;
}

const props = defineProps<LoginModalProps>();
const emits = defineEmits<{
  (event: "additionalHandler", currentVisibleState: boolean): void;
}>();

const isModalVisible = ref(props.externalOpenedState);

const { mutateAsync } = useSignInApi();
const queryClient = useQueryClient();
const router = useRoute();
const authRedirectUrl = useLocalStorage("authRedirectUrl", "");


const onSignIn = async (provider: string) => {
  const response = await mutateAsync(provider);

  if (response) {
    const currentBrowser = getCurrentBrowserName();
    let win: Window | null | undefined = null;
    if (currentBrowser === BrowserEnum.SAFARI) {
      authRedirectUrl.value = router.fullPath;
      window.location.replace(response)
    } else {
      win = spawnWindowInScreenCenter(response, "Movie Tracker Sign In", window, 800, 600);
    }

    win?.focus();
    const interval = setInterval(() => {
      if (win?.closed) {
        handleVisible(false);
        emits("additionalHandler", false);
        queryClient.invalidateQueries({ queryKey: [AuthQueryKeys.USER_PROFILE] });
        queryClient.removeQueries({ queryKey: [MediaListQueryKeys.GET_BY_ID] });
        queryClient.removeQueries({ queryKey: [MediaItemQueryKeys.GET_BY_MEDIA_LIST_ID] });
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
    :buttonColorScheme="props.buttonColorScheme"
    :buttonVariant="props.buttonVariant"
    :externalOpenedState="isModalVisible"
    :isHideTrigger="props.isHideTrigger"
    :maxWidth="350"
    :title="$t('auth.signIn')"
    isFullWidth
    v-bind="$attrs"
    @additional-handler="handleVisible"
  >
    <template #trigger>
      {{ props.btnTitle || $t("auth.signIn") }}
    </template>

    <template #content>
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
    </template>
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
