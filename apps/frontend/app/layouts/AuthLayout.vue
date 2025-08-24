<script setup lang="ts">
import { AuthHeader } from "~/widgets/header"
import { UiLayoutWrapper } from "../shared/ui/UiLayoutWrapper"
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
