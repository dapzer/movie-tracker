<script setup lang="ts">

import UiLayoutWrapper from "~/components/ui/UiLayoutWrapper.vue"
import { AuthHeader } from "~/widgets/header"
</script>

<template>
  <UiLayoutWrapper :class="$style.wrapper">
    <AuthHeader />
    <main>
      <slot />
    </main>
  </UiLayoutWrapper>
</template>

<style module lang="scss">
.wrapper {
  main {
    padding-bottom: unset;
  }
}
</style>
