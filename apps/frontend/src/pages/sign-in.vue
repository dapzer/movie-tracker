<script setup lang="ts">
import { navigateTo } from "#app"
import { useLocalePath } from "#i18n"
import { definePageMeta, useI18n, useSeoMeta } from "#imports"
import { useLocalStorage } from "@vueuse/core"
import { watch } from "vue"
import { SignInForm } from "~/features/auth"
import { useAuth } from "~/shared/composables/useAuth"
import { LocalStorageEnum } from "~/shared/types/localStorageEnum"
import { UiContainer } from "../shared/ui/UiContainer"

definePageMeta({
  layout: "auth-layout",
})

const { t } = useI18n()

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("auth.signIn")} | ${titleChunk}`
  },
  ogTitle() {
    return `%s | ${t("auth.signIn")}`
  },
})

const { isNotAuthorized, isLoadingProfile } = useAuth()
const localePath = useLocalePath()
const authRedirectUrl = useLocalStorage(LocalStorageEnum.AUTH_REDIRECT_URL, "")

watch([() => isNotAuthorized.value, () => isLoadingProfile.value, () => authRedirectUrl.value], () => {
  if (!isNotAuthorized.value && !isLoadingProfile.value && !authRedirectUrl.value) {
    navigateTo(localePath("/"))
  }
})
</script>

<template>
  <section :class="$style.wrapper">
    <UiContainer :class="$style.body">
      <SignInForm />
    </UiContainer>
  </section>
</template>

<style module lang="scss">
@import "~/shared/styles/breakpoints";
@import "~/shared/styles/mixins";

.wrapper {
  width: 100%;
  background:
    linear-gradient(270deg, #0d0d0d 43.14%, rgba(13, 13, 13, 0) 100%),
    url("/authBackground.webp") center;
  background-size: cover;
  height: calc(100vh - var(--s-header-height));

  .body {
    display: flex;
    justify-content: flex-end;
    height: 100%;
    padding-top: 30px;
  }

  @include tabletDevice() {
    background:
      linear-gradient(0deg, rgba(13, 13, 13, 0.9), rgba(13, 13, 13, 0.9)),
      url("/authBackground.webp") center;

    .body {
      justify-content: center;
    }
  }

  @include mobileDevice() {
    background: var(--c-main-background);

    .body {
      padding-left: 4px;
      padding-right: 4px;
    }
  }
}
</style>
