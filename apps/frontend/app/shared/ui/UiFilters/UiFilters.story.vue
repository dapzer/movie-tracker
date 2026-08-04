<script setup lang="ts">
import type {
  UiDateRangeFilterConfig,
  UiFiltersModel,
  UiMultiSelectFilterConfig,
  UiRangeFilterConfig,
  UiSingleSelectFilterConfig,
} from "~/shared/ui/UiFilters"
import { ref } from "vue"
import { UiFilters, UiFiltersDrawer } from "~/shared/ui/UiFilters"
import { UiTypography } from "~/shared/ui/UiTypography"

type AllFiltersConfig = [
      UiMultiSelectFilterConfig & { id: "genres" },
      UiSingleSelectFilterConfig & { id: "review-status" },
      UiRangeFilterConfig & { id: "rating" },
      UiDateRangeFilterConfig & { id: "release-date" },
]

type DrawerFiltersConfig = [
      UiMultiSelectFilterConfig & { id: "formats" },
      UiMultiSelectFilterConfig & { id: "genres" },
      UiSingleSelectFilterConfig & { id: "status" },
      UiRangeFilterConfig & { id: "rating" },
      UiDateRangeFilterConfig & { id: "releaseYear" },
]

const allFiltersConfig = [
  {
    type: "multiSelect",
    id: "genres",
    title: "Genres",
    drawerVariant: "checkbox",
    options: [
      { label: "Action", value: "action" },
      { label: "Drama", value: "drama" },
      { label: "Comedy", value: "comedy" },
    ],
  },
  {
    type: "singleSelect",
    id: "review-status",
    title: "Status",
    options: [
      { label: "Draft", value: "draft" },
      { label: "Pending", value: "pending" },
      { label: "Published", value: "published" },
    ],
    initialValue: "all",
  },
  {
    type: "range",
    id: "rating",
    title: "Rating",
    min: 0,
    max: 10,
    step: 1,
    minLabel: "No rating",
    maxLabel: "10",
  },
  {
    type: "dateRange",
    id: "release-date",
    title: "Release year",
    fromLabel: "From",
    toLabel: "To",
    minYear: 1900,
    maxYear: 2030,
    shortcuts: [2020, 2010, 2000, 1990],
  },
] satisfies AllFiltersConfig

const allFiltersModel = ref<UiFiltersModel<typeof allFiltersConfig>>({
  "genres": [],
  "review-status": "pending",
  "rating": [2, 8],
  "release-date": [2000, 2010],
})

const drawerFiltersConfig = [
  {
    type: "multiSelect",
    id: "formats",
    title: "Formats",
    drawerVariant: "checkbox",
    options: [
      { label: "Movie", value: "movie" },
      { label: "Series", value: "series" },
    ],
  },
  {
    type: "multiSelect",
    id: "genres",
    title: "Genres",
    drawerVariant: "tag",
    options: [
      { label: "Action", value: "action" },
      { label: "Drama", value: "drama" },
      { label: "Comedy", value: "comedy" },
    ],
  },
  {
    type: "singleSelect",
    id: "status",
    title: "Status",
    initialValue: "planned",
    options: [
      { label: "Planned", value: "planned" },
      { label: "Watching", value: "watching" },
      { label: "Completed", value: "completed" },
    ],
  },
  {
    type: "range",
    id: "rating",
    title: "Rating",
    min: 0,
    max: 10,
    step: 1,
    minLabel: "No rating",
    maxLabel: "10",
  },
  {
    type: "dateRange",
    id: "releaseYear",
    title: "Release year",
    fromLabel: "From",
    toLabel: "To",
    minYear: 1900,
    maxYear: 2030,
    shortcuts: [2020, 2010, 2000, 1990],
  },
] satisfies DrawerFiltersConfig

const drawerDefaultModel = ref<UiFiltersModel<typeof drawerFiltersConfig>>({
  formats: [],
  genres: [],
  status: "planned",
  rating: [0, 10],
  releaseYear: [undefined, undefined],
})

const drawerPreselectedModel = ref<UiFiltersModel<typeof drawerFiltersConfig>>({
  formats: ["movie"],
  genres: ["action", "drama"],
  status: "watching",
  rating: [3, 8],
  releaseYear: [2000, 2010],
})
</script>

<template>
  <Story
    group="ui-kit"
    title="UiFilters"
  >
    <Variant title="All filter types">
      <UiFilters
        v-model="allFiltersModel"
        :config="allFiltersConfig"
      />
      <UiTypography
        as="p"
        variant="description"
      >
        Genres: {{ allFiltersModel.genres.join(", ") || "none" }}
      </UiTypography>
      <UiTypography
        as="p"
        variant="description"
      >
        Status: {{ allFiltersModel["review-status"] ?? "all" }}
      </UiTypography>
      <UiTypography
        as="p"
        variant="description"
      >
        Rating: {{ allFiltersModel.rating[0] }} – {{ allFiltersModel.rating[1] }}
      </UiTypography>
      <UiTypography
        as="p"
        variant="description"
      >
        Release year: {{ allFiltersModel["release-date"][0] ?? "not set" }} – {{ allFiltersModel["release-date"][1] ?? "not set" }}
      </UiTypography>
    </Variant>

    <Variant title="Defaults">
      <UiFiltersDrawer
        v-model="drawerDefaultModel"
        :config="drawerFiltersConfig"
        title="Filters"
        reset-label="Reset filters"
      />
      <UiTypography
        as="pre"
        variant="description"
      >
        {{ JSON.stringify(drawerDefaultModel, null, 2) }}
      </UiTypography>
    </Variant>

    <Variant title="Preselected values">
      <UiFiltersDrawer
        v-model="drawerPreselectedModel"
        :config="drawerFiltersConfig"
        title="Filters"
        reset-label="Reset filters"
      />
      <UiTypography
        as="pre"
        variant="description"
      >
        {{ JSON.stringify(drawerPreselectedModel, null, 2) }}
      </UiTypography>
    </Variant>
  </Story>
</template>
