<script lang="ts" setup>
import { LanguageSelectorDropdown } from "~/features/languegeSelector"
import { AppLogo } from "~/shared/ui/appLogo"
import HeaderWrapper from "~/widgets/header/ui/common/HeaderWrapper.vue"
</script>

<template>
  <HeaderWrapper>
    <AppLogo />
    <LanguageSelectorDropdown />
  </HeaderWrapper>
</template>

<style lang="scss" module>

</style>
