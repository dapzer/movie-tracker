<script setup lang="ts">
import { useI18n, useSeoMeta } from "#imports"
import { CommunityListsHero, CommunityListsSections } from "~/widgets/communityLists"

const { t } = useI18n()

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("navigation.communityLists")} | ${titleChunk}`
  },
  ogTitle() {
    return `%s | ${t("navigation.communityLists")}`
  },
  ogDescription() {
    return t("communityLists.hero.description")
  },

})
</script>

<template>
  <div :class="$style.wrapper">
    <CommunityListsHero />
    <CommunityListsSections />
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/breakpoints";
@import "~/shared/styles/mixins";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 70px;

  @include tabletDevice {
    gap: 60px;
  }

  @include mobileDevice {
    gap: 60px;
  }
}
</style>
