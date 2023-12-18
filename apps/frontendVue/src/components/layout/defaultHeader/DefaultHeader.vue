<script lang="ts" setup>

import UiContainer from "~/components/ui/UiContainer.vue";
import DefaultHeaderLogo from "~/components/layout/defaultHeader/DefaultHeaderLogo.vue";
import DefaultHeaderNavigation from "~/components/layout/defaultHeader/DefaultHeaderNavigation.vue";
import { ref } from "vue";
import DefaultHeaderMobileMenu from "~/components/layout/defaultHeader/DefaultHeaderMobileMenu.vue";

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}
</script>

<template>
  <header :class="$style.wrapper">
    <UiContainer :class="$style.content">
      <DefaultHeaderLogo :is-mobile-menu-open="isMobileMenuOpen" />
      <DefaultHeaderNavigation
        :is-mobile-menu-open="isMobileMenuOpen"
        @toggleMobileMenu="toggleMobileMenu"
      />
      <DefaultHeaderMobileMenu
        v-if="isMobileMenuOpen"
        @toggleMobileMenu="toggleMobileMenu"
      />
    </UiContainer>
  </header>
</template>

<style lang="scss" module>
.wrapper {
  width: 100%;
  background: var(--c-accent);
  min-height: var(--s-header-height);
  z-index: var(--i-header);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>
