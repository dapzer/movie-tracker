<script setup lang="ts">
import { TmdbMediaTypeEnum, type TmdbPersonCastType, type TmdbPersonCrewType } from "@movie-tracker/types"
import { computed, ref, watch } from "vue"
import { getMediaTypeDeclensionTranslationKey, useI18n } from "#imports"
import { UiButton } from "~/components/newUi/UiButton"
import { UiTypography } from "~/components/newUi/UiTypography"
import { UiSelect } from "~/components/newUi/UiSelect"
import { MovieCardHorizontal } from "~/entities/movieCard"
import { UiDivider } from "~/components/newUi/UiDivider"
import { UiPagination } from "~/components/newUi/UiPagination"

interface PersonDetailsActingProps {
  crew: TmdbPersonCrewType[];
  cast: TmdbPersonCastType[];
}

const props = defineProps<PersonDetailsActingProps>();
const { t } = useI18n()
const filters = ref({
  mediaType: '',
  department: ''
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

  return Array.from(result).map((item) => ({ value: item, label: t(`details.department.${item}`) }))
})


const mediaTypes = computed(() => {
  const result = new Set<string>()

  for (const item of data.value) {
    result.add(item.movie.media_type)
  }

  return Array.from(result).map((item) => ({ value: item, label: t(`details.mediaType.${item}`) }))
})

const inMediaCounts = computed(() => {
  const result = {
    movie: 0,
    tv: 0
  }

  for (const item of data.value) {
    result[item.mediaTypes as keyof typeof result]++
  }

  return result
})

const filteredData = computed(() => {
  return data.value.filter((item) => {
    return (
        (filters.value.mediaType === '' || item.mediaTypes === filters.value.mediaType) &&
        (filters.value.department === '' || item.departments.includes(filters.value.department))
    )
  }).sort((a, b) => b.releaseDate ? new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime() : -1)
})

const clearFilters = () => {
  filters.value = {
    mediaType: '',
    department: ''
  }
}

</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.header">
      <UiTypography
        :class="$style.title"
        as="h3"
        variant="title3"
      >
        {{ t("details.acting") }}
      </UiTypography>
      <div :class="$style.filters">
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
          v-model="filters.department"
          :width="200"
          :options="departments"
          :placeholder="$t('details.department.title')"
        />
      </div>
    </div>
    <UiDivider />
    <UiTypography
      :class="$style.subheading"
      variant="subheading"
    >
      {{ t("details.participatedIn") }}
      {{ inMediaCounts.movie }} {{
        $t(getMediaTypeDeclensionTranslationKey(inMediaCounts.movie, TmdbMediaTypeEnum.MOVIE))
      }},
      {{ inMediaCounts.tv }} {{
        $t(getMediaTypeDeclensionTranslationKey(inMediaCounts.tv, TmdbMediaTypeEnum.TV))
      }}
    </UiTypography>
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
          <template #description>
            <UiTypography
              variant="description"
            >
              {{
                item.jobs ? [...item.jobs, ...(item.characters ? [item.characters] : [])].join(', ') :
                [...item.departments
                   .map((department: string) => t(`details.department.${department}`)),
                 ...(item.characters ? [item.characters] : [])]
                  .join(', ')
              }}
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
@import "~/styles/newVariables";
@import "~/styles/mixins";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;

    .title {
      white-space: nowrap;
      width: max-content;
      @include ellipsisText();
    }

    @include mobileDevice() {
      flex-direction: column;
      align-items: flex-start;
    }

    .filters {
      display: flex;
      gap: 20px;
      flex: 1 1 auto;
      max-height: max-content;
      justify-content: flex-end;

      @include mobileDevice() {
        width: 100%;
      }
    }
  }

  .subheading {
    color: var(--c-description);

  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .releaseDate {
      width: 42px;
      padding-right: 8px;
      font-weight: var(--fw-regular);
      color: var(--c-description);
    }
  }

  .pagination {
    margin-top: 20px;
  }
}
</style>
