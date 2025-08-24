<script setup lang="ts">
import { UiSocialList } from "../../UiSocialList"
</script>

<template>
  <UiSocialList
    :class="$style.wrapper"
    :social-list="{
      github: 'dapzer/movie-tracker',
      telegram: 'movie_tracker_news',
      discord: 'yeAXyC4TEr',
      twitter: 'AppMovieTracker',
    }"
  />
</template>

<style module lang="scss">
@import "~/shared/styles/breakpoints";
@import "~/shared/styles/mixins";

.wrapper {
  gap: 16px;

  span {
    width: 32px;
    height: 32px;

    @include mobilePlusDevice() {
      width: 28px;
      height: 28px;
    }
  }
}
</style>
