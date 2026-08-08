<script setup lang="ts">
import type { UiFiltersModel, UiMultiSelectFilterConfig, UiRangeFilterConfig } from "~/shared/ui/UiFilters"
import { useI18n } from "#imports"
import { MediaTypeEnum } from "@movie-tracker/types"
import { computed } from "vue"
import { useDebouncedSearchTerm } from "~/shared/composables/useDebouncedSearchTerm"
import { UiExpandableSearchInput } from "~/shared/ui/UiExpandableSearchInput"
import { UiFilters, UiFiltersDrawer } from "~/shared/ui/UiFilters"
import { refsToAccessorObject } from "~/shared/utils/refsToAccessorObject.ts"

const RATING_MIN = 0
const RATING_MAX = 10

const searchTerm = defineModel<string>("searchTerm", { default: "" })
const mediaTypesModel = defineModel<MediaTypeEnum[]>("mediaTypes", { default: () => [] })
const ratingModel = defineModel<[number, number]>("rating", { default: () => [RATING_MIN, RATING_MAX] })

const { t } = useI18n()
const { searchValue } = useDebouncedSearchTerm(searchTerm)

type UserProfileRatingsFiltersConfig = Array<
  UiMultiSelectFilterConfig & { id: "mediaTypes" }
  | UiRangeFilterConfig & { id: "rating" }
>

const filtersConfig = computed<UserProfileRatingsFiltersConfig>(() => {
  return [
    {
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
  ]
})

const filtersModel = computed<UiFiltersModel<UserProfileRatingsFiltersConfig>>(() => {
  return refsToAccessorObject({
    mediaTypes: mediaTypesModel,
    rating: ratingModel,
  })
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
          :config="filtersConfig"
        />
      </div>

      <div :class="$style.mobileFilters">
        <UiFiltersDrawer
          v-model="filtersModel"
          :config="filtersConfig"
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
