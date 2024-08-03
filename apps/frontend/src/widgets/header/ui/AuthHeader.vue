<script lang="ts" setup>
import HeaderWrapper from "~/widgets/header/ui/common/HeaderWrapper.vue"
import { AppLogo } from "~/shared/ui/appLogo"
import { LanguageSelectorDropdown } from "~/features/languegeSelector"
</script>

<template>
  <HeaderWrapper>
    <AppLogo />
    <LanguageSelectorDropdown />
  </HeaderWrapper>
</template>

<style lang="scss" module>

</style>
