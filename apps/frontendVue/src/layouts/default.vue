<script lang="ts" setup>

import DefaultHeader from "~/components/layout/defaultHeader/DefaultHeader.vue";
import DefaultFooter from "~/components/layout/defaultFooter/DefaultFooter.vue";
</script>

<template>
  <div :class="$style.wrapper">
    <DefaultHeader />
    <main>
      <slot />
    </main>
    <DefaultFooter />
  </div>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100%;

  main {
    padding: calc(var(--s-header-height) + 16px) 0;
    flex: 1 1 auto;

    @media screen and (max-width: var(--bp-md)) {
      min-height: 100vh;
    }
  }
}
</style>
