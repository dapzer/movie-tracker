<script setup lang="ts">

import { PopularList } from "~/features/popularList";
import { TmdbMediaTypeEnum } from "@movie-tracker/types";
import UiContainer from "~/components/ui/UiContainer.vue";
</script>

<template>
  <UiContainer as="section">
    <div :class="$style.wrapper">
      <PopularList
        :media-type="TmdbMediaTypeEnum.MOVIE"
        :title="$t('ui.popularMovies')"
      />
      <PopularList
        :media-type="TmdbMediaTypeEnum.TV"
        :title="$t('ui.popularTv')"
      />
    </div>
  </UiContainer>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  gap: 8px;
  flex-direction: column;
  padding-top: 20px;
}
</style>
