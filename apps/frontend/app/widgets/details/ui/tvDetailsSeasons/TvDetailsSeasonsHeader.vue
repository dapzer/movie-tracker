<script setup lang="ts">
import type { TmdbMediaDetailsType, TmdbSeasonDetailsType } from "@movie-tracker/types"
import { useLocalePath } from "#i18n"
import { computed } from "#imports"
import { MediaTypeEnum } from "@movie-tracker/types"
import { minsToTimeConverter } from "@movie-tracker/utils"
import { UiInfoHeader } from "~/shared/ui/UiInfoHeader"
import { getProxiedImageUrl } from "~/shared/utils/getProxiedImageUrl"
import MovieDetailsActions from "~/widgets/details/ui/MovieDetailsActions.vue"

interface TvDetailsSeasonsHeaderProps {
  details: TmdbMediaDetailsType
  seriesDetails: TmdbSeasonDetailsType[]
}

const props = defineProps<TvDetailsSeasonsHeaderProps>()
const localePath = useLocalePath()

const totalDuration = computed(() => {
  return minsToTimeConverter(
    props.seriesDetails.reduce((acc, season) => {
      season.episodes.forEach((el) => {
        acc += el.runtime
      })

      return acc
    }, 0) ?? 0,
  )
})

const title = computed(() => {
  return props.details.title || props.details.name
})
</script>

<template>
  <UiInfoHeader
    poster-size="small"
    :description="$t(`details.mediaType.tv`)"
    :image="props.details?.poster_path && getProxiedImageUrl(props.details?.poster_path, 350)"
    fallback-image="/defaultMoviePoster.svg"
    :title="title"
    :back-button-text="$t('details.backToTvPage')"
    :back-button-url="localePath(`/details/${MediaTypeEnum.TV}/${props.details.id}`)"
  >
    <template #posterFooter>
      <MovieDetailsActions
        hide-rating
        :class="$style.actionsMobile"
        :title="title"
        :media-id="props.details.id"
        :media-type="MediaTypeEnum.TV"
      />
    </template>
    <template #content>
      <MovieDetailsActions
        hide-rating
        :class="$style.actionsPc"
        :title="title"
        :media-id="props.details.id"
        :media-type="MediaTypeEnum.TV"
      />
    </template>

    <template
      v-if="props.details"
      #tableItems
    >
      <tr>
        <td>{{ $t("details.seasonsCount") }}</td>
        <td>{{ props.details?.number_of_seasons }}</td>
      </tr>
      <tr>
        <td>{{ $t("details.episodesCount") }}</td>
        <td>{{ props.details?.number_of_episodes }}</td>
      </tr>
      <tr v-if="!!totalDuration.days || !!totalDuration.hours || !!totalDuration.minutes">
        <td>{{ $t("details.totalViewingTime") }}</td>
        <td>
          {{ totalDuration.days ? `${totalDuration.days} ${$t("ui.time.shortDay")}` : "" }}
          {{ totalDuration.hours ? `${totalDuration.hours} ${$t("ui.time.shortHour")}` : "" }}
          {{ totalDuration.minutes ? `${totalDuration.minutes} ${$t("ui.time.shortMin")}` : "" }}
        </td>
      </tr>
    </template>
  </UiInfoHeader>
</template>

<style module lang="scss">
@import "~/shared/styles/breakpoints";
@import "~/shared/styles/mixins";

.actionsMobile {
  display: none !important;

  @include mobilePlusDevice() {
    display: flex !important;
    &,
    button {
      width: 100%;
    }
  }
}

.actionsPc {
  margin-top: auto;
  flex-direction: row;
  gap: 8px;

  button {
    margin: 0 !important;
  }

  @include mobilePlusDevice() {
    display: none !important;
  }
}
</style>
