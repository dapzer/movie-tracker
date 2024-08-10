<script setup lang="ts">

import { UiHoverCard } from "~/components/newUi/UiHoverCard"
import { MovieCard } from "~/entities/movieCard"
import type { TmdbSearchResponseResultItemType } from "@movie-tracker/types"
import MovieCardHoverMenu from "~/features/movieCardWithHoverMenu/ui/MovieCardHoverMenu.vue"

interface MovieCardWithHoverMenuProps {
  movie: TmdbSearchResponseResultItemType;
  width?: number;
}

const props = defineProps<MovieCardWithHoverMenuProps>();
</script>

<template>
  <UiHoverCard
    :indent="10"
    align="start"
    side="right"
  >
    <template #trigger>
      <MovieCard
        v-bind="$attrs"
        :movie="props.movie"
      />
    </template>

    <template #content>
      <MovieCardHoverMenu :movie="props.movie" />
    </template>
  </UiHoverCard>
</template>

<style scoped lang="scss">

</style>
