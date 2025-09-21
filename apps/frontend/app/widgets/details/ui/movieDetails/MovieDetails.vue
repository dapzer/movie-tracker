<script lang="ts" setup>
import type { GetCommunityListsWithMediaQueries } from "@movie-tracker/types"
import { useLocalePath } from "#i18n"
import { computed, createError, useI18n } from "#imports"
import { TmdbMediaTypeEnum } from "@movie-tracker/types"
import { arrayToString } from "@movie-tracker/utils"
import { useGetCommunityListsWithMediaApi } from "~/api/communityLists/useCommunityListsApi"
import { useGetMediaRatingByMediaIdApi } from "~/api/mediaRating/useMediaRatingApi"
import {
  useGetTmdbMovieCreditsApi,
  useGetTmdbMovieDetailsApi,
  useGetTmdbRecommendationsApi,
  useGetTmdbTvSeriesDetailsApi,
  useGetTmdbVideosApi,
} from "~/api/tmdb/useTmdbApi"
import { EpisodeCard } from "~/entities/episodeCard"
import { MediaListCard } from "~/entities/mediaList"
import { MovieCardWithHoverMenu } from "~/features/movieCardWithHoverMenu"
import { LanguagesEnum } from "~/shared/types/languagesEnum"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiSectionWithSeeMore } from "~/shared/ui/UiSectionWithSeeMore"
import { UiSlider } from "~/shared/ui/UiSlider"
import { formatDate } from "~/shared/utils/formatDate"
import { getProxiedImageUrl } from "~/shared/utils/getProxiedImageUrl"
import { useMovieDetailsSeo } from "~/widgets/details/model/useMovieDetailsSeo"
import { PersonWithDescription } from "~/widgets/personWithDescription"
import { VideoCardWithPlayer } from "~/widgets/videoCardWithPlayer"
import MovieDetailsHeader from "./MovieDetailsHeader.vue"

interface MovieDetailsProps {
  mediaId: number
  mediaType: TmdbMediaTypeEnum
}

const props = defineProps<MovieDetailsProps>()
const { locale, t } = useI18n()
const localePath = useLocalePath()

const queries = computed(() => ({
  mediaType: props.mediaType,
  mediaId: props.mediaId,
  language: locale.value,
}))

const getVideosQueries = computed(() => ({
  mediaType: props.mediaType,
  mediaId: props.mediaId,
  language: locale.value,
  includeVideoLanguage: locale.value === LanguagesEnum.RU ? [LanguagesEnum.EN, LanguagesEnum.RU].join(",") : undefined,
}))

const getCommunityListsWithMediaQueries = computed<GetCommunityListsWithMediaQueries>(() => ({
  mediaId: props.mediaId,
}))

const isTv = computed(() => props.mediaType === TmdbMediaTypeEnum.TV)

const tmdbGetMovieDetailsApi = useGetTmdbMovieDetailsApi(queries)
const tmdbGetRecommendationsApi = useGetTmdbRecommendationsApi(queries)
const tmdbGetMovieCreditsApi = useGetTmdbMovieCreditsApi(queries)
const tmdbGetVideosApi = useGetTmdbVideosApi(getVideosQueries)
const tmdbGetTvSeriesDetailsApi = useGetTmdbTvSeriesDetailsApi(queries, isTv)
const getMediaRatingApi = useGetMediaRatingByMediaIdApi({
  mediaId: props.mediaId,
})
const getCommunityListsWithMediaApi = useGetCommunityListsWithMediaApi(getCommunityListsWithMediaQueries)

await Promise.all([
  tmdbGetMovieDetailsApi.suspense().then((res) => {
    if ((res.error as Error)?.message.startsWith("404")) {
      throw createError({
        statusCode: 404,
        message: t("ui.errors.pageNotFound"),
      })
    }
  }),
  tmdbGetRecommendationsApi.suspense(),
  tmdbGetMovieCreditsApi.suspense(),
  tmdbGetVideosApi.suspense(),
  (isTv.value && tmdbGetTvSeriesDetailsApi.suspense()),
  getMediaRatingApi.suspense(),
  getCommunityListsWithMediaApi.suspense(),
])

useMovieDetailsSeo({
  credits: tmdbGetMovieCreditsApi.data.value,
  mediaId: props.mediaId,
  mediaType: props.mediaType,
  media: tmdbGetMovieDetailsApi.data.value,
})

const videosList = computed(() => {
  if (!tmdbGetVideosApi.data.value?.results.length) {
    return []
  }

  return [...tmdbGetVideosApi.data.value.results].sort((a, b) => {
    const isATrailer = a.type === "Trailer" || a.type === "Teaser"
    const isBTrailer = b.type === "Trailer" || b.type === "Teaser"

    if (isATrailer && !isBTrailer) {
      return -1
    }
    if (!isATrailer && isBTrailer) {
      return 1
    }

    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  })
})

const castList = computed(() => {
  if (!tmdbGetMovieCreditsApi.data.value?.cast.length) {
    return []
  }

  return tmdbGetMovieCreditsApi.data.value.cast.slice(0, 12)
})

const releasedEpisodes = computed(() => {
  const seasons = tmdbGetTvSeriesDetailsApi.data.value
  const lastEpisodeToAir = tmdbGetMovieDetailsApi.data.value?.last_episode_to_air

  if (!seasons?.length || !lastEpisodeToAir) {
    return []
  }

  const episodes = []
  const today = new Date()
  const firstSeasonIndex = seasons.findIndex(season => season.season_number === 1)

  for (let i = firstSeasonIndex; i < seasons?.length; i++) {
    const season = seasons[i]
    const episodeCount = season?.episodes?.length
    if (!episodeCount) {
      continue
    }

    for (let j = 0; j < episodeCount; j++) {
      const episode = season?.episodes[j]

      if (episode?.air_date && new Date(episode?.air_date) < today) {
        episodes.push(episode)
      }
      if (episodes.length >= 20) {
        break
      }
    }
    if (episodes.length >= 20) {
      break
    }
  }

  return episodes
})
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <MovieDetailsHeader
      :credits="tmdbGetMovieCreditsApi.data.value"
      :details="tmdbGetMovieDetailsApi.data.value"
      :media-type="props.mediaType"
      :overview="tmdbGetMovieDetailsApi.data.value?.overview"
    />

    <UiSectionWithSeeMore
      v-if="releasedEpisodes.length"
      :title="$t(`details.releasedEpisodes`)"
      :see-more-url="localePath(`/details/${TmdbMediaTypeEnum.TV}/${props.mediaId}/seasons`)"
      :see-more-text="$t(`details.episodesList`)"
    >
      <UiSlider
        :data="releasedEpisodes"
        :max-width="295"
        :buttons-top-offset="78"
      >
        <template #slide="{ item }">
          <EpisodeCard
            full-height
            :episode="item.episode_number"
            :season="item.season_number"
            :image-src="getProxiedImageUrl(item.still_path, 250)"
            :title="item.name"
            :description="formatDate(item.air_date, locale)"
          />
        </template>
      </UiSlider>
    </UiSectionWithSeeMore>

    <UiSectionWithSeeMore
      v-if="videosList.length"
      :title="$t(`details.videosTitle`)"
      hide-see-more
    >
      <UiSlider
        :data="videosList"
        :max-width="295"
        :buttons-top-offset="84"
      >
        <template #slide="{ item }">
          <VideoCardWithPlayer
            full-height
            :title="item.name"
            :description="formatDate(item.published_at, locale)"
            :preview-src="`https://i.ytimg.com/vi/${item.key}/hq720.jpg`"
            :video-url="`https://www.youtube.com/embed/${item.key}?autoplay=1`"
            :source-url="`https://www.youtube.com/watch?v=${item.key}`"
          />
        </template>
      </UiSlider>
    </UiSectionWithSeeMore>

    <UiSectionWithSeeMore
      v-if="castList.length"
      :title="$t(`details.castTitle`)"
      :see-more-url="localePath(`/details/${props.mediaType}/${props.mediaId}/cast`)"
    >
      <div :class="$style.castList">
        <PersonWithDescription
          v-for="person in castList"
          :key="person.id"
          :class="$style.castItem"
          :name="person.name"
          :description="person.character || arrayToString(person.roles, 'character')"
          :person-page-url="localePath(`/details/${TmdbMediaTypeEnum.PERSON}/${person.id}`)"
          :image-src="getProxiedImageUrl(person.profile_path, 260)"
        />
      </div>
    </UiSectionWithSeeMore>

    <UiSectionWithSeeMore
      v-if="getCommunityListsWithMediaApi.data.value?.items.length"
      :title="$t(`details.listsWithMediaTitle`)"
      :see-more-url="localePath(`/details/${props.mediaType}/${props.mediaId}/community-lists`)"
    >
      <UiSlider
        :data="getCommunityListsWithMediaApi.data.value?.items"
        :max-width="396"
        :buttons-top-offset="142"
      >
        <template #slide="{ item }">
          <MediaListCard
            full-height
            :list="item"
          />
        </template>
      </UiSlider>
    </UiSectionWithSeeMore>

    <UiSectionWithSeeMore
      v-if="tmdbGetRecommendationsApi.data.value?.results.length"
      :title="$t(`details.recommendationsTitle`)"
      :see-more-url="localePath(`/details/${props.mediaType}/${props.mediaId}/recommendations`)"
    >
      <UiSlider
        :data="tmdbGetRecommendationsApi.data.value?.results"
        :max-width="195"
        :buttons-top-offset="142"
      >
        <template #slide="{ item }">
          <MovieCardWithHoverMenu
            full-height
            :movie="item"
          />
        </template>
      </UiSlider>
    </UiSectionWithSeeMore>
  </UiContainer>
</template>

<style lang="scss" module>
@import "~/shared/styles/breakpoints";
@import "~/shared/styles/mixins";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 70px;
  padding-top: 50px !important;

  @include mobileDevice() {
    padding-top: 0 !important;
  }

  .castList {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    row-gap: 40px;
    column-gap: 72px;
    width: 100%;

    @include tabletDevice() {
      grid-template-columns: repeat(3, 1fr);
      column-gap: 48px;
      row-gap: 30px;

      .castItem:nth-child(n + 10) {
        display: none;
      }
    }

    @include mobileDevice() {
      grid-template-columns: repeat(1, 1fr);
      column-gap: 48px;
      row-gap: 30px;

      .castItem:nth-child(n + 7) {
        display: none;
      }
    }
  }
}
</style>
