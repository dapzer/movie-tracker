<script setup lang="ts">
import type {
  UiDateRangeFilterConfig,
  UiFiltersModel,
  UiMultiSelectFilterConfig,
  UiRangeFilterConfig,
} from "~/shared/ui/UiFilters"
import { useI18n } from "#imports"
import { MediaTypeEnum, TMDB_GENRE_IDS, TMDB_RELEASE_STATUSES } from "@movie-tracker/types"
import { computed } from "vue"
import { useDebouncedSearchTerm } from "~/shared/composables/useDebouncedSearchTerm"
import { UiExpandableSearchInput } from "~/shared/ui/UiExpandableSearchInput"
import { UiFilters } from "~/shared/ui/UiFilters"
import MediaListDetailsFiltersDrawer from "./drawer/MediaListDetailsFiltersDrawer.vue"

const RATING_MIN = 0
const RATING_MAX = 10

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

const { t } = useI18n()
const { searchValue } = useDebouncedSearchTerm(searchTerm)

type MediaListDesktopFiltersConfig = [
  UiMultiSelectFilterConfig & { id: "mediaTypes" },
  UiRangeFilterConfig & { id: "rating" },
  UiMultiSelectFilterConfig & { id: "releaseStatuses" },
  UiDateRangeFilterConfig & { id: "releaseYear" },
  UiMultiSelectFilterConfig & { id: "genres" },
]

const desktopFiltersConfig = computed(() => [
  {
    type: "multiSelect",
    id: "mediaTypes",
    title: t("mediaList.filters.mediaType"),
    options: [
      {
        label: t("details.mediaType.movie"),
        value: MediaTypeEnum.MOVIE,
      },
      {
        label: t("details.mediaType.tv"),
        value: MediaTypeEnum.TV,
      },
    ],
  },
  {
    type: "range",
    id: "rating",
    title: t("ui.rating.single"),
    min: RATING_MIN,
    max: RATING_MAX,
    step: 1,
    minLabel: t("mediaList.filters.withoutRating"),
    getLabel: (value: number) => value === RATING_MIN ? t("mediaList.filters.withoutRating") : undefined,
  },
  {
    type: "multiSelect",
    id: "releaseStatuses",
    title: t("mediaList.filters.releaseStatus"),
    options: TMDB_RELEASE_STATUSES.map(value => ({
      label: t(`details.allStatusNames.${value}`),
      value,
    })),
  },
  {
    type: "dateRange",
    id: "releaseYear",
    title: t("mediaList.filters.releaseYear.title"),
    fromLabel: t("mediaList.filters.releaseYear.from"),
    toLabel: t("mediaList.filters.releaseYear.to"),
  },
  {
    type: "multiSelect",
    id: "genres",
    title: t("mediaList.filters.genres"),
    options: TMDB_GENRE_IDS.map(value => ({ label: t(`details.genres.all.${value}`), value })),
  },
] satisfies MediaListDesktopFiltersConfig)

const desktopFiltersModel = computed<UiFiltersModel<MediaListDesktopFiltersConfig>>(() => {
  return {
    get mediaTypes() {
      return mediaTypesModel.value
    },
    set mediaTypes(value) {
      mediaTypesModel.value = value as MediaTypeEnum[]
    },
    get rating() {
      return ratingModel.value
    },
    set rating(value) {
      ratingModel.value = value
    },
    get releaseStatuses() {
      return releaseStatusesModel.value
    },
    set releaseStatuses(value) {
      releaseStatusesModel.value = value
    },
    get releaseYear() {
      return releaseYearModel.value
    },
    set releaseYear(value) {
      releaseYearModel.value = value
    },
    get genres() {
      return genresModel.value
    },
    set genres(value) {
      genresModel.value = value
    },
  }
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

      <div :class="$style.desktopFilters">
        <UiFilters
          v-model="desktopFiltersModel"
          :config="desktopFiltersConfig"
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
@use "~/shared/styles/mixins" as *;

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

@include mobilePlusDevice {
  .searchInput {
    max-width: 100%;
  }

  .desktopFilters {
    display: none;
  }

  .list {
    justify-content: space-between;
    flex-wrap: nowrap;
  }

  .mobileFilters {
    display: block;
  }
}
</style>
