<script setup lang="ts">
import type { MediaTypeEnum } from "@movie-tracker/types"
import { useDebouncedSearchTerm } from "~/shared/composables/useDebouncedSearchTerm"
import { UiExpandableSearchInput } from "~/shared/ui/UiExpandableSearchInput"
import MediaListDetailsFiltersDrawer from "./drawer/MediaListDetailsFiltersDrawer.vue"
import MediaListDetailsGenresFilterPopover from "./MediaListDetailsGenresFilterPopover.vue"
import MediaListDetailsRatingFilterPopover from "./MediaListDetailsRatingFilterPopover.vue"
import MediaListDetailsReleaseStatusFilterPopover from "./MediaListDetailsReleaseStatusFilterPopover.vue"
import MediaListDetailsReleaseYearFilterPopover from "./MediaListDetailsReleaseYearFilterPopover.vue"
import MediaListDetailsTypeFilterPopover from "./MediaListDetailsTypeFilterPopover.vue"

export interface MediaListDetailsFilters {
  searchTerm: string
  mediaTypes: MediaTypeEnum[]
  rating: [number, number]
  releaseYear: [number | undefined, number | undefined]
  genres: string[]
  releaseStatuses: string[]
}

const searchTerm = defineModel<string>("searchTerm", { default: "" })
const mediaTypesModel = defineModel<MediaTypeEnum[]>("mediaTypes", { default: () => [] })
const ratingModel = defineModel<MediaListDetailsFilters["rating"]>("rating", { default: () => [0, 10] })
const releaseYearModel = defineModel<MediaListDetailsFilters["releaseYear"]>("releaseYear", { default: () => [undefined, undefined] })
const genresModel = defineModel<MediaListDetailsFilters["genres"]>("genres", { default: () => [] })
const releaseStatusesModel = defineModel<MediaListDetailsFilters["releaseStatuses"]>("releaseStatuses", { default: () => [] })

const { searchValue } = useDebouncedSearchTerm(searchTerm)
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.list">
      <UiExpandableSearchInput
        v-model="searchValue"
        :wrapper-class="$style.searchInput"
        :placeholder="$t('search.placeholder')"
      />

      <div :class="$style.desktopFilters">
        <MediaListDetailsTypeFilterPopover
          v-model="mediaTypesModel"
        />
        <MediaListDetailsRatingFilterPopover
          v-model="ratingModel"
        />
        <MediaListDetailsReleaseStatusFilterPopover
          v-model="releaseStatusesModel"
        />
        <MediaListDetailsReleaseYearFilterPopover
          v-model="releaseYearModel"
        />
        <MediaListDetailsGenresFilterPopover
          v-model="genresModel"
        />
      </div>

      <div :class="$style.mobileFilters">
        <MediaListDetailsFiltersDrawer
          v-model:media-types="mediaTypesModel"
          v-model:rating="ratingModel"
          v-model:release-year="releaseYearModel"
          v-model:genres="genresModel"
          v-model:release-statuses="releaseStatusesModel"
        />
      </div>
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

.desktopFilters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.mobileFilters {
  display: none;
}

@include mobileDevice {
  .searchInput {
    max-width: 100%;
    flex: 1 1 100%;
  }

  .desktopFilters {
    display: none;
  }

  .mobileFilters {
    width: 100%;
    display: block;
  }
}
</style>
