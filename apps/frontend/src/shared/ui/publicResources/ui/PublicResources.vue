<script setup lang="ts">

import { UiSocialList } from "~/components/ui/UiSocialList"
</script>

<template>
  <!--  TODO: Add Discord link -->
  <UiSocialList
    :class="$style.wrapper"
    :social-list="{
      github: 'dapzer/movie-tracker',
      telegram: 'movie_tracker_news',
    }"
  />
</template>

<style module lang="scss">
@import "~/styles/variables";
@import "~/styles/mixins";

.wrapper {
  gap: 16px;

  svg {
    width: 32px;

    @include mobilePlusDevice() {
      width: 28px;
    }
  }
}
</style>
