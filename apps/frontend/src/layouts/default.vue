<script lang="ts" setup>

import DefaultHeader from "~/components/layout/defaultHeader/DefaultHeader.vue";
import UiLayoutWrapper from "~/components/ui/UiLayoutWrapper.vue";
import DefaultFooter from "~/components/layout/defaultFooter/DefaultFooter.vue";
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
