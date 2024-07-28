<script lang="ts" setup>

import UiLayoutWrapper from "~/components/ui/UiLayoutWrapper.vue";
import { DefaultHeader } from "~/widgets/header"
import { DefaultFooter } from "~/widgets/footer"
</script>

<template>
  <UiLayoutWrapper>
    <DefaultHeader />
    <main>
      <slot />
    </main>
    <DefaultFooter />
  </UiLayoutWrapper>
</template>
