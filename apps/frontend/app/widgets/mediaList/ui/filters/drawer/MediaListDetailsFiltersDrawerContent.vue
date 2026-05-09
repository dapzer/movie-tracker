<script setup lang="ts">
import type { MediaListDetailsFilters } from "@/widgets/mediaList/ui/filters/MediaListDetailsFilters.vue"
import { onBeforeUnmount, useI18n } from "#imports"
import { MediaTypeEnum } from "@movie-tracker/types"
import { computed, ref } from "vue"
import { UiButton } from "@/shared/ui/UiButton"
import { UiDivider } from "@/shared/ui/UiDivider"
import { UiRangeSlider } from "@/shared/ui/UiRangeSlider"
import { UiTag } from "@/shared/ui/UiTag"
import { UiYearRangePicker } from "@/shared/ui/UiYearRangePicker"
import MediaListDetailsFiltersDrawerCheckboxList
  from "~/widgets/mediaList/ui/filters/drawer/MediaListDetailsFiltersDrawerCheckboxList.vue"
import MediaListDetailsFiltersDrawerSection
  from "~/widgets/mediaList/ui/filters/drawer/MediaListDetailsFiltersDrawerSection.vue"

const RATING_MIN = 0
const RATING_MAX = 10

const { t } = useI18n()

const mediaTypesModel = defineModel<MediaListDetailsFilters["mediaTypes"]>("mediaTypes", { default: () => [] })
const ratingModel = defineModel<MediaListDetailsFilters["rating"]>("rating", { default: () => [RATING_MIN, RATING_MAX] })
const releaseYearModel = defineModel<MediaListDetailsFilters["releaseYear"]>("releaseYear", { default: () =>
  [undefined, undefined] })
const genresModel = defineModel<MediaListDetailsFilters["genres"]>("genres", { default: () => [] })
const releaseStatusesModel = defineModel<MediaListDetailsFilters["releaseStatuses"]>("releaseStatuses", { default: () => [] })

const draftMediaTypes = ref<MediaListDetailsFilters["mediaTypes"]>([...mediaTypesModel.value])
const draftRating = ref<MediaListDetailsFilters["rating"]>([ratingModel.value[0], ratingModel.value[1]])
const draftReleaseYear = ref<MediaListDetailsFilters["releaseYear"]>([releaseYearModel.value[0], releaseYearModel.value[1]])
const draftGenres = ref<MediaListDetailsFilters["genres"]>([...genresModel.value])
const draftReleaseStatuses = ref<MediaListDetailsFilters["releaseStatuses"]>([...releaseStatusesModel.value])

const mediaTypeOptions = computed(() => {
  return [
    {
      label: t("details.mediaType.movie"),
      value: MediaTypeEnum.MOVIE,
    },
    {
      label: t("details.mediaType.tv"),
      value: MediaTypeEnum.TV,
    },
  ]
})

const genreOptions = computed(() => {
  return [
    "12",
    "14",
    "16",
    "18",
    "27",
    "28",
    "35",
    "36",
    "37",
    "53",
    "80",
    "99",
    "878",
    "9648",
    "10402",
    "10749",
    "10751",
    "10752",
    "10770",
  ].map(el => ({ label: t(`details.genres.all.${el}`), value: el }))
})

const releaseStatusOptions = computed(() => {
  return [
    "rumored",
    "canceled",
    "planned",
    "pilot",
    "in production",
    "returning series",
    "post production",
    "released",
    "ended",
  ].map(el => ({ label: t(`details.allStatusNames.${el}`), value: el }))
})

function resetDraftFilters() {
  draftMediaTypes.value = []
  draftRating.value = [RATING_MIN, RATING_MAX]
  draftReleaseYear.value = [undefined, undefined]
  draftGenres.value = []
  draftReleaseStatuses.value = []
}

function applyDraftFilters() {
  mediaTypesModel.value = [...draftMediaTypes.value]
  ratingModel.value = [draftRating.value[0], draftRating.value[1]]
  releaseYearModel.value = [draftReleaseYear.value[0], draftReleaseYear.value[1]]
  genresModel.value = [...draftGenres.value]
  releaseStatusesModel.value = [...draftReleaseStatuses.value]
}

function toggleGenre(genreId: string) {
  if (draftGenres.value.includes(genreId)) {
    draftGenres.value = draftGenres.value.filter(id => id !== genreId)
    return
  }

  draftGenres.value = [...draftGenres.value, genreId]
}

function toggleReleaseStatus(status: string) {
  if (draftReleaseStatuses.value.includes(status)) {
    draftReleaseStatuses.value = draftReleaseStatuses.value.filter(currentStatus => currentStatus !== status)
    return
  }

  draftReleaseStatuses.value = [...draftReleaseStatuses.value, status]
}

onBeforeUnmount(() => {
  applyDraftFilters()
})
</script>

<template>
  <div :class="$style.content">
    <MediaListDetailsFiltersDrawerSection :title="$t('mediaList.filters.mediaType')">
      <MediaListDetailsFiltersDrawerCheckboxList
        v-model="draftMediaTypes"
        :options="mediaTypeOptions"
      />
    </MediaListDetailsFiltersDrawerSection>

    <UiDivider />

    <MediaListDetailsFiltersDrawerSection :title="$t('mediaList.filters.releaseStatus')">
      <MediaListDetailsFiltersDrawerCheckboxList
        v-model="draftReleaseStatuses"
        :options="releaseStatusOptions"
      />
    </MediaListDetailsFiltersDrawerSection>

    <UiDivider />

    <MediaListDetailsFiltersDrawerSection :title="$t('mediaList.filters.genres')">
      <div :class="$style.genres">
        <UiTag
          v-for="genre in genreOptions"
          :key="genre.label"
          as="button"
          type="button"
          text-variant="labelSmall"
          :color="draftGenres.includes(genre.value) ? 'blue' : 'gray'"
          @click="toggleGenre(genre.value)"
        >
          {{ genre.label }}
        </UiTag>
      </div>
    </MediaListDetailsFiltersDrawerSection>

    <UiDivider />

    <MediaListDetailsFiltersDrawerSection :title="$t('ui.rating.single')">
      <UiRangeSlider
        v-model="draftRating"
        :min="RATING_MIN"
        :max="RATING_MAX"
        :step="1"
      />
    </MediaListDetailsFiltersDrawerSection>

    <UiDivider />

    <MediaListDetailsFiltersDrawerSection :title="$t('mediaList.filters.releaseYear.title')">
      <UiYearRangePicker
        v-model="draftReleaseYear"
        :from-label="t('mediaList.filters.releaseYear.from')"
        :to-label="t('mediaList.filters.releaseYear.to')"
      />
    </MediaListDetailsFiltersDrawerSection>

    <UiDivider />

    <UiButton
      :class="$style.resetButton"
      variant="boxed"
      scheme="medium-gray"
      @click="resetDraftFilters"
    >
      {{ t("mediaList.filters.reset") }}
    </UiButton>
  </div>
</template>

<style module lang="scss">
.content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.genres {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  row-gap: 6px;
}

.resetButton {
  width: 100%;
}
</style>
