<script setup lang="ts">

import { useLocalePath } from "#i18n"
import { useLocalStorage } from "@vueuse/core"
import { useRoute } from "#app"

const localePath = useLocalePath();
const authRedirectUrl = useLocalStorage('authRedirectUrl', '');
const router = useRoute();


const onClickLink = () => {
  authRedirectUrl.value = router.path;
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
