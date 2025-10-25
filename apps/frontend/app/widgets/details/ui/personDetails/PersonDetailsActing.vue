<script setup lang="ts">
import type { TmdbPersonCastType, TmdbPersonCrewType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { TmdbMediaTypeEnum } from "@movie-tracker/types"
import { computed, ref, watch } from "vue"
import { MovieCardHorizontal } from "~/entities/movieCard"
import { UiButton } from "~/shared/ui/UiButton"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiListHeader } from "~/shared/ui/UiListHeader"
import { UiPagination } from "~/shared/ui/UiPagination"
import { UiRating } from "~/shared/ui/UiRating"
import { UiSelect } from "~/shared/ui/UiSelect"
import { UiTypography } from "~/shared/ui/UiTypography"
import { getMediaTypeDeclensionTranslationKey } from "~/shared/utils/getMediTypeDeclensionTranslationKey"

interface PersonDetailsActingProps {
  crew: TmdbPersonCrewType[]
  cast: TmdbPersonCastType[]
}

const props = defineProps<PersonDetailsActingProps>()
const { t } = useI18n()
const filters = ref({
  mediaType: "",
  department: "",
})
const currentPage = ref(1)

watch(() => filters.value, () => {
  currentPage.value = 1
}, { deep: true })

const data = computed(() => {
  const result = new Map()

  props.crew.forEach((item) => {
    const currentRecord = result.get(item.id)

    result.set(item.id, {
      id: item.id,
      mediaTypes: item.media_type,
      movie: item,
      releaseDate: item.release_date || item.first_air_date,
      jobs: [...(currentRecord?.jobs || []), t(`details.job.${item.job}`)],
      departments: [...(currentRecord?.departments || []), item.department],
    })
  })

  props.cast.forEach((item) => {
    const currentRecord = result.get(item.id)

    result.set(item.id, {
      id: item.id,
      mediaTypes: item.media_type,
      movie: item,
      releaseDate: item.release_date || item.first_air_date,
      jobs: currentRecord?.jobs || [],
      departments: currentRecord?.departments || [],
      characters: [...(currentRecord?.characters || []), item.character],
    })
  })
  return Array.from(result.values())
})

const departments = computed(() => {
  const result = new Set<string>()

  for (const item of data.value) {
    for (const department of item.departments) {
      result.add(department)
    }
  }

  return Array.from(result).map(item => ({ value: item, label: t(`details.department.${item}`) }))
})

const mediaTypes = computed(() => {
  const result = new Set<string>()

  for (const item of data.value) {
    result.add(item.movie.media_type)
  }

  return Array.from(result).map(item => ({ value: item, label: t(`details.mediaType.${item}`) }))
})

const inMediaCounts = computed(() => {
  const result = {
    movie: 0,
    tv: 0,
  }

  for (const item of data.value) {
    result[item.mediaTypes as keyof typeof result]++
  }

  return result
})

const filteredData = computed(() => {
  return data.value.filter((item) => {
    return (
      (filters.value.mediaType === "" || item.mediaTypes === filters.value.mediaType)
      && (filters.value.department === "" || item.departments.includes(filters.value.department))
    )
  }).sort((a, b) => {
    if (!a.releaseDate && !b.releaseDate) {
      return 0
    }
    if (!a.releaseDate) {
      return 1
    }
    if (!b.releaseDate) {
      return -1
    }

    return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  })
})

function clearFilters() {
  filters.value = {
    mediaType: "",
    department: "",
  }
}

function getDescription(jobs?: string[], departments?: string[], characters?: string[]) {
  const result = []

  if (characters?.length) {
    result.push(...characters)
  }

  if (departments?.length && !jobs?.length) {
    result.push(...departments.map(department => t(`details.department.${department}`)))
  }

  if (jobs?.length) {
    result.push(...jobs)
  }

  return result.filter(el => !!el).join(", ")
}
</script>

<template>
  <div :class="$style.wrapper">
    <UiListHeader
      :title="$t('details.acting')"
      :subtitle="`${$t('details.participatedIn')} ${inMediaCounts.movie} ${$t(getMediaTypeDeclensionTranslationKey(inMediaCounts.movie,
                                                                                                                   TmdbMediaTypeEnum.MOVIE))}, ${inMediaCounts.tv} ${$t(getMediaTypeDeclensionTranslationKey(inMediaCounts.tv, TmdbMediaTypeEnum.TV))}`"
    >
      <template #controls>
        <UiButton
          variant="text"
          scheme="link"
          @click="clearFilters"
        >
          {{ $t("ui.clear") }}
        </UiButton>
        <UiSelect
          v-model="filters.mediaType"
          :width="200"
          :options="mediaTypes"
          :placeholder="$t('ui.all')"
        />
        <UiSelect
          v-if="departments.length"
          v-model="filters.department"
          :width="200"
          :options="departments"
          :placeholder="$t('details.department.title')"
        />
      </template>
    </UiListHeader>
    <div :class="$style.content">
      <template
        v-for="(item, index) in filteredData.slice((currentPage - 1) * 10, currentPage * 10)"
        :key="item.id"
      >
        <MovieCardHorizontal
          :movie="item.movie"
          size="small"
          :image-width="54"
        >
          <template #precontent>
            <UiTypography
              :class="$style.releaseDate"
            >
              {{ item.releaseDate ? new Date(item.releaseDate).getFullYear() : '-' }}
            </UiTypography>
          </template>
          <template #afterTitle>
            <UiRating
              :value="item.movie.vote_average"
            />
          </template>
          <template #description>
            <UiTypography
              variant="description"
            >
              {{ getDescription(item.jobs, item.departments, item.characters) }}
            </UiTypography>
          </template>
        </MovieCardHorizontal>
        <UiDivider v-if="index < filteredData.length - 1" />
      </template>
    </div>
    <UiPagination
      v-model="currentPage"
      :class="$style.pagination"
      :total-items="filteredData.length"
      :pages-on-sides="1"
      :items-per-page="10"
    />
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/breakpoints";
@import "~/shared/styles/mixins";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .content {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .releaseDate {
      min-width: 42px;
      margin-right: 8px;
      font-weight: var(--fw-regular);
      color: var(--c-description);

      @include mobileDevice() {
        margin-right: -4px;
      }
    }
  }

  .pagination {
    margin-top: 20px;
  }
}
</style>
