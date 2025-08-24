<script setup lang="ts">
import { useRoute } from "#app"
import { useLocalePath } from "#i18n"
import { onUnmounted, useI18n } from "#imports"
import { useQueryClient } from "@tanstack/vue-query"
import { useLocalStorage } from "@vueuse/core"
import { useRouter } from "vue-router"
import { useSignInByProviderApi } from "~/api/auth/useAuthApi"
import { MediaItemQueryKeys } from "~/api/mediaItem/mediaItemApiQueryKeys"
import { MediaListQueryKeys } from "~/api/mediaList/mediaListApiQueryKeys"
import { UserQueryKeys } from "~/api/user/userApiQueryKeys"
import { authProvidersList } from "~/features/auth/model/authProvidersList"
import { BrowserEnum } from "~/shared/types/browserEnum"
import { LanguagesEnum } from "~/shared/types/languagesEnum"
import { LocalStorageEnum } from "~/shared/types/localStorageEnum"
import { UiButton } from "~/shared/ui/UiButton"
import { getCurrentBrowserName } from "~/shared/utils/getCurrentBrowserName"
import { spawnWindowInScreenCenter } from "~/shared/utils/spawnWindowInScreenCenter"

const signInByProviderApi = useSignInByProviderApi()
const queryClient = useQueryClient()
const route = useRoute()
const router = useRouter()
const authRedirectUrl = useLocalStorage(LocalStorageEnum.AUTH_REDIRECT_URL, "")
const { locale } = useI18n()
const localePath = useLocalePath()

async function onSignIn(provider: string) {
  const response = await signInByProviderApi.mutateAsync(provider)

  if (response) {
    const currentBrowser = getCurrentBrowserName()
    let win: Window | null | undefined = null
    if (currentBrowser === BrowserEnum.SAFARI) {
      authRedirectUrl.value = route.fullPath
      window.location.assign(response.url)
    }
    else {
      win = spawnWindowInScreenCenter(response.url, "Movie Tracker Sign In", window, 800, 600)
    }

    win?.focus()
    const interval = setInterval(() => {
      if (win?.closed) {
        queryClient.invalidateQueries({ queryKey: [UserQueryKeys.PROFILE] })
        queryClient.invalidateQueries({ queryKey: [MediaListQueryKeys.GET_ALL] })
        queryClient.invalidateQueries({ queryKey: [MediaItemQueryKeys.GET_ALL] })
        queryClient.removeQueries({ queryKey: [MediaListQueryKeys.GET_BY_ID] })
        queryClient.removeQueries({ queryKey: [MediaItemQueryKeys.GET_BY_MEDIA_LIST_ID] })
        router.push(localePath(authRedirectUrl.value))
        clearInterval(interval)
      }
    }, 1000)
  }
}

onUnmounted(() => {
  localStorage.removeItem(LocalStorageEnum.AUTH_REDIRECT_URL)
})
</script>

<template>
  <div :class="$style.wrapper">
    <UiButton
      v-for="provider in authProvidersList"
      :key="provider.provider"
      size="large"
      @click="onSignIn(provider.provider)"
    >
      <component
        :is="provider.icon"
        :class="$style.icon"
      />
      <span
        :class="[$style.text, {
          [$style.titleEn]: locale === LanguagesEnum.EN,
        }]"
      >
        {{
          $t("auth.signInWith", {
            provider: provider.title,
          })
        }}
      </span>
    </UiButton>
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";

.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;

  & > button {
    width: 100%;
    background: var(--c-card-background-hovered) !important;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: start;
    gap: 16px;

    .icon {
      font-size: 20px;
      flex-shrink: 0;
    }

    &:hover,
    &:active,
    &:focus {
      background: var(--c-stroke) !important;
    }

    .text {
      max-width: 208px;
      width: 100%;
      font-family: inherit;
      font-size: inherit;
      font-weight: inherit;
      color: inherit;

      &.titleEn {
        max-width: 155px;
      }

      @include ellipsisText();
    }
  }

  /*  */
}
</style>
