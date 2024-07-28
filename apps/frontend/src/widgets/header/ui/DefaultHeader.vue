<script lang="ts" setup>

import { ref } from "vue";
import HeaderWrapper from "~/widgets/header/ui/common/HeaderWrapper.vue"
import DefaultHeaderMobileMenu from "~/widgets/header/ui/defaultHeader/DefaultHeaderMobileMenu.vue"
import DefaultHeaderLeftContent from "~/widgets/header/ui/defaultHeader/DefaultHeaderLeftContent.vue"
import DefaultHeaderRightContent from "~/widgets/header/ui/defaultHeader/DefaultHeaderRightContent.vue"

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}
</script>

<template>
  <HeaderWrapper>
    <DefaultHeaderLeftContent v-model:is-mobile-menu-open="isMobileMenuOpen" />
    <DefaultHeaderRightContent />
    <DefaultHeaderMobileMenu
      v-if="isMobileMenuOpen"
      @toggle-mobile-menu="toggleMobileMenu"
    />
  </HeaderWrapper>
</template>

<style lang="scss" module>
</style>
