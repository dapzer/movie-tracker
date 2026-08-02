<script setup lang="ts">
import type {
  UiDateRangeFilterConfig,
  UiFiltersModel,
  UiMultiSelectFilterConfig,
  UiRangeFilterConfig,
  UiSingleSelectFilterConfig,
} from "~/shared/ui/UiFilters"
import { ref } from "vue"
import { UiFilters } from "~/shared/ui/UiFilters"
import { UiTypography } from "~/shared/ui/UiTypography"

type StoryFiltersConfig = [
  UiMultiSelectFilterConfig & { id: "genres" },
  UiSingleSelectFilterConfig & { id: "review-status" },
  UiRangeFilterConfig & { id: "rating" },
  UiDateRangeFilterConfig & { id: "release-date" },
]

const config = [
  {
    type: "multiSelect",
    id: "genres",
    title: "Genres",
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
    title: "Release date",
    options: [
      { label: "Last 30 days", value: [0, 30] },
      { label: "Last 90 days", value: [0, 90] },
      { label: "Last year", value: [0, 365] },
    ],
  },
] satisfies StoryFiltersConfig

const filters = ref<UiFiltersModel<typeof config>>({
  "genres": [],
  "review-status": "pending",
  "rating": [2, 8],
  "release-date": [0, 30],
})
</script>

<template>
  <Story
    group="ui-kit"
    title="UiFilters"
  >
    <Variant title="All filter types">
      <UiFilters
        v-model="filters"
        :config="config"
      />
      <UiTypography
        as="p"
        variant="description"
      >
        Genres: {{ filters.genres.join(", ") || "none" }}
      </UiTypography>
      <UiTypography
        as="p"
        variant="description"
      >
        Status: {{ filters["review-status"] ?? "all" }}
      </UiTypography>
      <UiTypography
        as="p"
        variant="description"
      >
        Rating: {{ filters.rating[0] }} – {{ filters.rating[1] }}
      </UiTypography>
      <UiTypography
        as="p"
        variant="description"
      >
        Release date: {{ filters["release-date"][0] }} – {{ filters["release-date"][1] }} days
      </UiTypography>
    </Variant>
  </Story>
</template>
