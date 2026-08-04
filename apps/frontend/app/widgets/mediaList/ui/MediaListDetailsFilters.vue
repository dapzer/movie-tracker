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
import { useDebouncedSearchTerm } from "~/shared/composables/useDebouncedSearchTerm.ts"
import { UiExpandableSearchInput } from "~/shared/ui/UiExpandableSearchInput"
import { UiFilters, UiFiltersDrawer } from "~/shared/ui/UiFilters"

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

interface MediaListFilterConfigs {
  mediaTypes: UiMultiSelectFilterConfig & { id: "mediaTypes" }
  rating: UiRangeFilterConfig & { id: "rating" }
  releaseStatuses: UiMultiSelectFilterConfig & { id: "releaseStatuses" }
  releaseYear: UiDateRangeFilterConfig & { id: "releaseYear" }
  genres: UiMultiSelectFilterConfig & { id: "genres" }
}

type MediaListFiltersConfig = Array<MediaListFilterConfigs[keyof MediaListFilterConfigs]>

const filterConfigs = computed(() => ({
  mediaTypes: {
    type: "multiSelect",
    id: "mediaTypes",
    title: t("mediaList.filters.mediaType"),
    drawerVariant: "checkbox",
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
  rating: {
    type: "range",
    id: "rating",
    title: t("ui.rating.single"),
    min: RATING_MIN,
    max: RATING_MAX,
    step: 1,
    minLabel: t("mediaList.filters.withoutRating"),
    getLabel: (value: number) => value === RATING_MIN ? t("mediaList.filters.withoutRating") : undefined,
  },
  releaseStatuses: {
    type: "multiSelect",
    id: "releaseStatuses",
    title: t("mediaList.filters.releaseStatus"),
    drawerVariant: "checkbox",
    options: TMDB_RELEASE_STATUSES.map((value: string) => ({
      label: t(`details.allStatusNames.${value}`),
      value,
    })),
  },
  releaseYear: {
    type: "dateRange",
    id: "releaseYear",
    title: t("mediaList.filters.releaseYear.title"),
    fromLabel: t("mediaList.filters.releaseYear.from"),
    toLabel: t("mediaList.filters.releaseYear.to"),
  },
  genres: {
    type: "multiSelect",
    id: "genres",
    title: t("mediaList.filters.genres"),
    drawerVariant: "tag",
    options: TMDB_GENRE_IDS.map((value: string) => ({ label: t(`details.genres.all.${value}`), value })),
  },
} satisfies MediaListFilterConfigs))

const desktopFiltersConfig = computed<MediaListFiltersConfig>(() => [
  filterConfigs.value.mediaTypes,
  filterConfigs.value.rating,
  filterConfigs.value.releaseStatuses,
  filterConfigs.value.releaseYear,
  filterConfigs.value.genres,
])

const mobileFiltersConfig = computed<MediaListFiltersConfig>(() => [
  filterConfigs.value.mediaTypes,
  filterConfigs.value.releaseStatuses,
  filterConfigs.value.genres,
  filterConfigs.value.rating,
  filterConfigs.value.releaseYear,
])

const filtersModel = computed<UiFiltersModel<MediaListFiltersConfig>>(() => {
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
          v-model="filtersModel"
          :config="desktopFiltersConfig"
        />
      </div>

      <div :class="$style.mobileFilters">
        <UiFiltersDrawer
          v-model="filtersModel"
          :config="mobileFiltersConfig"
          :title="$t('mediaList.filters.title')"
          :reset-label="$t('mediaList.filters.reset')"
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
