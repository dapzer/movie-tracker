<script lang="ts" setup>
import { useRoute } from "#app"
import { definePageMeta, getCurrentBrowserName, onMounted } from "#imports"
import { useLocalStorage } from "@vueuse/core"
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { useSignInCallbackApi } from "~/api/auth/useAuthApi"
import { UiButton } from "~/shared/ui/UiButton"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiLoadingIndicator } from "~/shared/ui/UiLoadingIndicator"
import { UiTypography } from "~/shared/ui/UiTypography"
import { BrowserEnum } from "~/types/browserEnum"
import { LocalStorageEnum } from "~/types/localStorageEnum"

const { params, query } = useRoute()
const signInCallbackApi = useSignInCallbackApi()
const authRedirectUrl = useLocalStorage(LocalStorageEnum.AUTH_REDIRECT_URL, "")
const router = useRouter()

definePageMeta({
  layout: "auth-layout",
})

const isError = ref(false)
const isPending = computed(() => signInCallbackApi.status.value === "pending")

function closeWindow() {
  window.close()
}

onMounted(async () => {
  try {
    if (!query.code) {
      isError.value = true
      return
    }

    await signInCallbackApi.mutateAsync({
      provider: params.provider as string,
      code: query.code as string,
    })

    const currentBrowser = getCurrentBrowserName()

    if (authRedirectUrl.value && currentBrowser === BrowserEnum.SAFARI) {
      await router.replace(authRedirectUrl.value)
      authRedirectUrl.value = ""
    }
    else {
      closeWindow()
    }
  }
  catch (e) {
    isError.value = true
  }
})
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <template v-if="isPending">
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
      <UiTypography variant="title2">
        {{ $t("auth.authError") }}
      </UiTypography>
      <UiTypography>
        {{ $t("auth.authErrorHint") }}
      </UiTypography>
      <UiButton @click="closeWindow()">
        {{ $t("auth.closeLoginWindow") }}
      </UiButton>
    </template>
  </UiContainer>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - var(--s-header-height));
  gap: 16px;
  align-items: center;
  justify-content: center;
  text-align: center;

  button {
    margin-top: 8px;
  }
}
</style>
