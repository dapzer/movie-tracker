<script lang="ts" setup>

import UiTypography from "~/components/ui/UiTypography.vue";
import { useRoute } from "#app";
import { definePageMeta, onMounted, useSignInCallbackApi } from "#imports";
import UiLoadingIndicator from "~/components/ui/UiLoadingIndicator.vue";
import { ref } from "vue";
import UiButton from "~/components/ui/UiButton.vue";
import LanguageSelector from "~/features/languegeSelector/ui/LanguageSelector.vue";
import { useLocalStorage } from "@vueuse/core";
import { useRouter } from "vue-router";

const { params, query } = useRoute();
const signInCallbackApi = useSignInCallbackApi();
const authRedirectUrl = useLocalStorage("authRedirectUrl", "");
const router = useRouter();

definePageMeta({
  layout: "clear-layout"
});

const isError = ref(false);

const closeWindow = () => {
  window.close();
};

onMounted(async () => {
  try {
    if (!query.code) {
      isError.value = true;
      return;
    }

    await signInCallbackApi.mutateAsync({
      provider: params.provider as string,
      code: query.code as string
    });

    if (authRedirectUrl.value) {
      await router.replace(authRedirectUrl.value);
      authRedirectUrl.value = "";
    } else {
      closeWindow();
    }
  } catch (e) {
    isError.value = true;
    return;
  }
});
</script>

<template>
  <div :class="$style.wrapper">
    <LanguageSelector :class="$style.languageSelector" />
    <template v-if="signInCallbackApi.isPending">
      <UiTypography
        as="span"
        variant="title2"
      >
        {{ $t("auth.authInProgress") }}...
      </UiTypography>
      <UiLoadingIndicator
        :size="64"
        :thickness="5"
      />
    </template>

    <template v-else-if="isError">
      <UiTypography
        as="span"
        variant="title2"
      >
        {{ $t("auth.authError") }}
      </UiTypography>
      <UiTypography>
        {{ $t("auth.authErrorHint") }}
      </UiTypography>
      <UiButton @click="closeWindow()">
        {{ $t("auth.closeLoginWindow") }}
      </UiButton>
    </template>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;

  .languageSelector {
    position: absolute;
    top: 16px;
    left: var(--s-indent);
    z-index: 1;
  }
}
</style>
