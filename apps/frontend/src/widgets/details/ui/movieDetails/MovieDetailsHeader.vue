<script lang="ts" setup>
import type { TmdbCreditsType, TmdbMediaDetailsType } from "@movie-tracker/types"
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { TmdbMediaTypeEnum } from "@movie-tracker/types"
import { arrayToString, convertNumberToCurrency, getMovieDirectors } from "@movie-tracker/utils"
import { computed } from "vue"
import { UiInfoHeader } from "~/shared/ui/UiInfoHeader"
import { UiRating } from "~/shared/ui/UiRating"
import { formatDate } from "~/shared/utils/formatDate"
import { getProxiedImageUrl } from "~/shared/utils/getProxiedImageUrl"
import MovieDetailsActions from "~/widgets/details/ui/MovieDetailsActions.vue"
import MovieDetailsProducers from "./MovieDetailsProducers.vue"

interface MovieDetailsHeaderProps {
  details?: TmdbMediaDetailsType | null
  mediaType?: TmdbMediaTypeEnum
  credits?: TmdbCreditsType | null
  overview?: string
}

const props = defineProps<MovieDetailsHeaderProps>()
const { locale } = useI18n()
const localePath = useLocalePath()

const producers = computed(() => {
  if (!props.credits || props.mediaType !== TmdbMediaTypeEnum.MOVIE)
    return []
  return getMovieDirectors(props.credits.crew)
})

const title = computed(() => {
  if (!props.details)
    return ""
  return props.details?.title || props.details?.name
})
</script>

<template>
  <UiInfoHeader
    :description="$t(`details.mediaType.${props.mediaType}`)"
    :image="props.details?.poster_path && getProxiedImageUrl(props.details?.poster_path, 350)"
    fallback-image="/defaultMoviePoster.svg"
    :title="title"
    :overview="props.overview"
  >
    <template
      v-if="props.details && props.mediaType"
      #posterFooter
    >
      <MovieDetailsActions
        :class="$style.actions"
        :media-id="props.details.id"
        :media-type="props.mediaType"
      />
    </template>

    <template
      v-if="props.details"
      #tableItems
    >
      <tr>
        <td>{{ $t("details.title") }}</td>
        <td>{{ props.details?.original_title || props.details?.original_name }}</td>
      </tr>
      <tr>
        <td>{{ $t("details.userScore") }}</td>
        <td><UiRating :value="props.details?.vote_average" /></td>
      </tr>
      <tr v-if="props.details?.release_date || props.details?.first_air_date">
        <td>{{ $t("details.releaseDate") }}</td>
        <td data-allow-mismatch>
          {{ formatDate(props.details?.release_date || props.details?.first_air_date, locale) }}
        </td>
      </tr>
      <template v-if="props.mediaType === TmdbMediaTypeEnum.TV">
        <tr v-if="props.details.last_air_date">
          <td>{{ $t("details.lastAirDate") }}</td>
          <td data-allow-mismatch>
            {{ formatDate(props.details.last_air_date, locale) }}
          </td>
        </tr>
        <tr v-if="props.details.next_episode_to_air?.air_date">
          <td>{{ $t("details.nextAirDate") }}</td>
          <td data-allow-mismatch>
            {{ formatDate(props.details.next_episode_to_air?.air_date, locale) }}
          </td>
        </tr>
      </template>
      <tr v-if="props.details?.genres.length">
        <td>{{ $t("details.genre") }}</td>
        <td>{{ arrayToString(props.details.genres, "name") }}</td>
      </tr>
      <tr v-if="producers.length">
        <td>{{ $t("details.director") }}</td>
        <td><MovieDetailsProducers :producers="producers" /></td>
      </tr>
      <tr v-if="props.details?.created_by?.length">
        <td>{{ $t("details.director") }}</td>
        <td><MovieDetailsProducers :producers="props.details?.created_by" /></td>
      </tr>
      <tr v-if="!!props.details?.production_countries?.length || !!props.details?.origin_country?.length">
        <td>{{ $t("details.productionCountry") }}</td>
        <td>{{ arrayToString(props.details?.production_countries, "name") || arrayToString(props.details?.origin_country) }}</td>
      </tr>
      <tr v-if="props.details?.production_companies?.length">
        <td>{{ $t("details.productionCompanies") }}</td>
        <td>{{ arrayToString(props.details.production_companies, "name") }}</td>
      </tr>
      <tr v-if="props.details?.budget">
        <td>{{ $t("details.budget") }}</td>
        <td>{{ convertNumberToCurrency(props.details.budget, "USD", locale) }}</td>
      </tr>
      <tr v-if="props.details?.revenue">
        <td>{{ $t("details.revenue") }}</td>
        <td>{{ convertNumberToCurrency(props.details.revenue, "USD", locale) }}</td>
      </tr>
      <template v-if="props.mediaType === TmdbMediaTypeEnum.TV">
        <tr v-if="props.details?.status">
          <td>{{ $t("details.seriesStatus") }}</td>
          <td>{{ $t(`details.seriesStatusName.${props.details?.status.toLowerCase()}`) }}</td>
        </tr>
        <tr>
          <td>{{ $t("details.seasonsCount") }}</td>
          <td>
            {{ props.details?.number_of_seasons }} <NuxtLink :to="localePath(`/details/${TmdbMediaTypeEnum.TV}/${props.details?.id}/seasons`)">
              ({{ $t("details.episodesList") }})
            </NuxtLink>
          </td>
        </tr>
        <tr>
          <td>{{ $t("details.episodesCount") }}</td>
          <td>{{ props.details?.number_of_episodes }}</td>
        </tr>
      </template>
      <tr v-if="!!props.details?.runtime || !!props.details?.episode_run_time?.length">
        <td>{{ $t("details.runTime") }}</td>
        <td>{{ props.details?.runtime || arrayToString(props.details?.episode_run_time) }} {{ $t("details.runTimeMins") }}</td>
      </tr>
    </template>
  </UiInfoHeader>
</template>

<style lang="scss" module>
.actions {
  button {
    width: 100%;
  }
}
</style>
