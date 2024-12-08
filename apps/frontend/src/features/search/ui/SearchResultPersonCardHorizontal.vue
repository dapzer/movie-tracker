<script setup lang="ts">

import type { TmdbSearchResponseResultItemType } from "@movie-tracker/types"
import PersonCardHorizontal from "~/entities/personCard/ui/PersonCardHorizontal.vue"

interface SearchResultMovieCardHorizontalProps {
  person: TmdbSearchResponseResultItemType;
}

const props = defineProps<SearchResultMovieCardHorizontalProps>();
</script>

<template>
  <PersonCardHorizontal
    :person="props.person"
    :image-width="60"
  />
</template>

<style module lang="scss">
</style>
