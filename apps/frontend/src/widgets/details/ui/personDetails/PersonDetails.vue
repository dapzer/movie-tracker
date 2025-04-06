<script lang="ts" setup>
import { createError, useI18n } from "#imports"
import { TmdbMediaTypeEnum } from "@movie-tracker/types"
import { computed } from "vue"
import {
  useGetTmdbPersonCreditsApi,
  useGetTmdbPersonDetailsApi,
  useGetTmdbPersonExternalIdsApi,
} from "~/api/tmdb/useTmdbApi"
import { MovieCardHorizontal } from "~/entities/movieCard"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiSectionWithSeeMore } from "~/shared/ui/UiSectionWithSeeMore"
import { UiSlider } from "~/shared/ui/UiSlider"
import { UiTypography } from "~/shared/ui/UiTypography"
import { formatDate } from "~/shared/utils/formatDate"
import { usePersonDetailsSeo } from "~/widgets/details/model/usePersonDetailsSeo"
import PersonDetailsActing from "~/widgets/details/ui/personDetails/PersonDetailsActing.vue"
import PersonDetailsHeader from "~/widgets/details/ui/personDetails/PersonDetailsHeader.vue"

interface PersonDetailsProps {
  mediaId: number
}

const props = defineProps<PersonDetailsProps>()
const { locale, t } = useI18n()

const personQueries = computed(() => ({
  mediaType: TmdbMediaTypeEnum.PERSON,
  mediaId: props.mediaId,
  language: locale.value,
}))

const creditsQueries = computed(() => ({
  personId: props.mediaId,
  language: locale.value,
}))

const tmdbGetPersonDetailsApi = useGetTmdbPersonDetailsApi(personQueries)
const tmdbGetPersonCreditsApi = useGetTmdbPersonCreditsApi(creditsQueries)
const tmdbGetPersonExternalIdsApi = useGetTmdbPersonExternalIdsApi(personQueries)

await Promise.all([
  tmdbGetPersonDetailsApi.suspense().then((res) => {
    if ((res.error as Error)?.message.startsWith("404")) {
      throw createError({
        statusCode: 404,
        message: t("ui.errors.pageNotFound"),
      })
    }
  }),
  tmdbGetPersonCreditsApi.suspense(),
  tmdbGetPersonExternalIdsApi.suspense(),
])

const knowFor = computed(() => {
  if (!tmdbGetPersonCreditsApi.data.value)
    return []
  const result = new Map()

  tmdbGetPersonCreditsApi.data.value.cast.forEach((item) => {
    const currentRecord = result.get(item.id)
    const characters = []

    if (currentRecord?.character) {
      characters.push(currentRecord.character)
    }

    if (item.character) {
      characters.push(item.character)
    }

    result.set(item.id, {
      ...item,
      character: characters.join(", "),
    })
  })

  return Array.from(result.values()).sort((a, b) => b.vote_count - a.vote_count).slice(0, 20)
})

usePersonDetailsSeo(tmdbGetPersonDetailsApi.data.value)
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <PersonDetailsHeader
      :details="tmdbGetPersonDetailsApi.data.value"
      :external-ids="tmdbGetPersonExternalIdsApi.data.value"
    />

    <UiSectionWithSeeMore
      v-if="knowFor.length"
      :title="$t(`details.knowFor.title`)"
      hide-see-more
    >
      <UiSlider
        :class="$style.slider"
        :data="knowFor"
        :max-width="294"
      >
        <template #slide="{ item }">
          <MovieCardHorizontal
            :class="$style.knowForCard"
            full-height
            :movie="item"
            :image-width="89"
            :sub-description="formatDate(item.release_date || item.first_air_date, locale)"
          >
            <template #description>
              <UiTypography
                ellipsis
                variant="description"
              >
                {{ item.character }}
              </UiTypography>
            </template>
          </MovieCardHorizontal>
        </template>
      </UiSlider>

      <div :class="$style.knowForMobile">
        <MovieCardHorizontal
          v-for="item in knowFor.slice(0, 6)"
          :key="item.id"
          :class="$style.knowForCard"
          :movie="item"
          :image-width="80"
          :sub-description="formatDate(item.release_date || item.first_air_date, locale)"
        >
          <template #description>
            <UiTypography
              ellipsis
              variant="description"
            >
              {{ item.character }}
            </UiTypography>
          </template>
        </MovieCardHorizontal>
      </div>
    </UiSectionWithSeeMore>

    <PersonDetailsActing
      v-if="tmdbGetPersonCreditsApi.data.value?.crew?.length || tmdbGetPersonCreditsApi.data?.value?.cast.length"
      :crew="tmdbGetPersonCreditsApi.data.value.crew"
      :cast="tmdbGetPersonCreditsApi.data.value.cast"
    />
  </UiContainer>
</template>

<style lang="scss" module>
@import "~/shared/styles/variables";
@import "~/shared/styles/mixins";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 70px;
  padding-top: 50px !important;

  @include mobileDevice() {
    padding-top: 0 !important;
  }

  .slider {
    @include mobileDevice() {
      display: none;
    }
  }

  .knowForMobile {
    display: none;

    @include mobileDevice() {
      display: flex;
      flex-direction: column;
    }
  }

  .knowForCard {
    &:not(:hover) {
      background: none;
    }
  }
}
</style>
