<script lang="ts" setup>
import { ref } from "vue"
import SearchModal from "~/features/search/ui/SearchModal.vue"
import HeaderWrapper from "~/widgets/header/ui/common/HeaderWrapper.vue"
import DefaultHeaderLeftContent from "~/widgets/header/ui/defaultHeader/DefaultHeaderLeftContent.vue"
import DefaultHeaderMobileMenu from "~/widgets/header/ui/defaultHeader/DefaultHeaderMobileMenu.vue"
import DefaultHeaderRightContent from "~/widgets/header/ui/defaultHeader/DefaultHeaderRightContent.vue"

const isMobileMenuOpen = ref(false)
const isSearchModalOpen = ref(false)
</script>

<template>
  <HeaderWrapper>
    <DefaultHeaderLeftContent v-model:is-mobile-menu-open="isMobileMenuOpen" />
    <DefaultHeaderRightContent @handle-open-search-modal="isSearchModalOpen = true" />
    <DefaultHeaderMobileMenu
      v-if="isMobileMenuOpen"
      v-model="isMobileMenuOpen"
    />
    <SearchModal
      v-if="isSearchModalOpen"
      v-model="isSearchModalOpen"
    />
  </HeaderWrapper>
</template>

<style lang="scss" module>
</style>
