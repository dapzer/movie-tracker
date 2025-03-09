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
    }"
  />
</template>

<style module lang="scss">
@import "~/styles/variables";
@import "~/styles/mixins";

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
