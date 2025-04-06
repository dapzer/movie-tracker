<script setup lang="ts">
import { useRoute } from "#app"
import { useLocalePath } from "#i18n"
import { useLocalStorage } from "@vueuse/core"
import { LocalStorageEnum } from "~/shared/types/localStorageEnum"

const localePath = useLocalePath()
const authRedirectUrl = useLocalStorage(LocalStorageEnum.AUTH_REDIRECT_URL, "")
const router = useRoute()

function onClickLink() {
  authRedirectUrl.value = router.path
}
</script>

<template>
  <NuxtLink
    :to="localePath('sign-in')"
    @click="onClickLink"
  >
    <slot />
  </NuxtLink>
</template>

<style scoped lang="scss">

</style>
