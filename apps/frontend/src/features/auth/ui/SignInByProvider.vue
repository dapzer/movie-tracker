<script setup lang="ts">
import { string } from 'yup';
import { getCurrentBrowserName } from '~/utils/getCurrentBrowserName';
import { BrowserEnum } from '~/types/browserEnum';
import { spawnWindowInScreenCenter } from '~/utils/spawnWindowInScreenCenter';
import { useLocalStorage } from '@vueuse/core';
import { useSignInByProviderApi } from '~/api/auth/useAuthApi';
import { useRoute } from '#app';
import { signInMethods } from '~/features/auth/model/signInMethods';
import UiButton from '~/components/ui/UiButton.vue';
import { useHandleResetUserData } from '~/composables/useHandleResetUserData';
import { SignUpLocalStorageKey } from '~/features/auth/model/SignUpLocalStorageKey';

const emits = defineEmits<{
  (event: 'onSuccessSignIn'): void;
}>();

const signInByProviderApi = useSignInByProviderApi();
const authRedirectUrl = useLocalStorage(SignUpLocalStorageKey.CALLBACK_REDIRECT_URL, '');
const router = useRoute();

const { handleResetUserStates } = useHandleResetUserData();


const onSignInByProvider = async (provider: string) => {
  const response = await signInByProviderApi.mutateAsync(provider);

  if (response) {
    const currentBrowser = getCurrentBrowserName();
    let win: Window | null | undefined = null;
    if (currentBrowser === BrowserEnum.SAFARI) {
      authRedirectUrl.value = router.fullPath;
      window.location.assign(response.url);
    } else {
      win = spawnWindowInScreenCenter(response.url, 'Movie Tracker Sign In', window, 800, 600);
    }

    win?.focus();
    const interval = setInterval(() => {
      if (win?.closed) {
        handleResetUserStates();
        emits('onSuccessSignIn');
        clearInterval(interval);
      }
    }, 1000);
  }
};

</script>

<template>
  <div :class="$style.wrapper">
    <UiButton
      v-for="method in signInMethods"
      :key="method.provider"
      :style="{ '--bg': method.color }"
      @click="onSignInByProvider(method.provider)"
    >
      <component :is="method.icon" />
    </UiButton>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: unset;

  button {
    padding: unset;
    width: 42px;
    height: 42px;
    background: var(--bg);
    border-radius: 50%;

    &:hover {
      color: var(--c-secondary) !important;
    }
  }
}
</style>
