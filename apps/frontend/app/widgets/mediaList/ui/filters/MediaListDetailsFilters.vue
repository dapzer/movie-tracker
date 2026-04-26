<script setup lang="ts">
import type { MediaTypeEnum } from "@movie-tracker/types"
import { ref } from "vue"
import { useDebouncedSearchTerm } from "~/shared/composables/useDebouncedSearchTerm"
import { UiExpandableSearchInput } from "~/shared/ui/UiExpandableSearchInput"
import MediaListDetailsGenresFilterPopup from "~/widgets/mediaList/ui/filters/MediaListDetailsGenresFilterPopup.vue"
import MediaListDetailsRatingFilterPopup from "~/widgets/mediaList/ui/filters/MediaListDetailsRatingFilterPopup.vue"
import MediaListDetailsTypeFilterPopup from "~/widgets/mediaList/ui/filters/MediaListDetailsTypeFilterPopup.vue"
import MediaListDetailsReleaseYearFilterPopup from "./MediaListDetailsReleaseYearFilterPopup.vue"

export interface MediaListDetailsFilters {
  searchTerm: string
  mediaTypes: MediaTypeEnum[]
  rating: [number, number]
  releaseYear: [number | undefined, number | undefined ]
  genres: string[]
}

const searchTerm = defineModel<string>("searchTerm", { default: "" })

const { searchValue } = useDebouncedSearchTerm(searchTerm)

const filters = ref<MediaListDetailsFilters>({
  searchTerm: "",
  mediaTypes: [],
  rating: [0, 10],
  releaseYear: [undefined, undefined],
  genres: [],
})
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.list">
      <UiExpandableSearchInput
        v-model="searchValue"
        :wrapper-class="$style.searchInput"
        :placeholder="$t('search.placeholder')"
      />

      <MediaListDetailsTypeFilterPopup v-model="filters.mediaTypes" />
      <MediaListDetailsRatingFilterPopup v-model="filters.rating" />
      <MediaListDetailsReleaseYearFilterPopup v-model="filters.releaseYear" />
      <MediaListDetailsGenresFilterPopup v-model="filters.genres" />
    </div>
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";

.wrapper {
  width: 100%;
}
.list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.searchInput {
  width: fit-content;
  max-width: 210px;
}

@include mobileDevice {
  .searchInput {
    max-width: 100%;
    flex: 1 1 100%;
  }
}
</style>
