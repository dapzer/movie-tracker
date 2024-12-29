<script lang="ts" setup>
import {
  useGetTmdbMovieCreditsApi,
  useGetTmdbMovieDetailsApi,
  useGetTmdbRecommendationsApi,
  useGetTmdbTvSeriesDetailsApi,
  useGetTmdbVideosApi
} from "~/api/tmdb/useTmdbApi";
import { TmdbMediaTypeEnum } from "@movie-tracker/types";
import { computed, createError, getProxiedImageUrl, useI18n } from "#imports";
import MovieDetailsHeader from "./MovieDetailsHeader.vue";
import { UiContainer } from "~/components/ui/UiContainer";
import { VideoCardWithPlayer } from "~/widgets/videoCardWithPlayer";
import { useMovieDetailsSeo } from "~/widgets/details/model/useMovieDetailsSeo";
import { UiSectionWithSeeMore } from "~/components/ui/UiSectionWithSeeMore"
import { UiSlider } from "~/components/ui/UiSlider"
import { LanguagesEnum } from "~/types/languagesEnum"
import { arrayToString } from "@movie-tracker/utils"
import { PersonWithDescription } from "~/widgets/personWithDescription"
import { useLocalePath } from "#i18n"
import { EpisodeCard } from "~/entities/episodeCard"
import { formatDate } from "~/utils/formatDate"
import { MovieCardWithHoverMenu } from "~/features/movieCardWithHoverMenu"

interface MovieDetailsProps {
  mediaId: number;
  mediaType: TmdbMediaTypeEnum;
}

const props = defineProps<MovieDetailsProps>();
const { locale, t } = useI18n();
const localePath = useLocalePath();

const queries = computed(() => ({
  mediaType: props.mediaType,
  mediaId: props.mediaId,
  language: locale.value
}));

const getVideosQueries = computed(() => ({
  mediaType: props.mediaType,
  mediaId: props.mediaId,
  language: locale.value,
  includeVideoLanguage: locale.value === LanguagesEnum.RU ? [LanguagesEnum.EN, LanguagesEnum.RU].join(",") : undefined
}));

const isTv = computed(() => props.mediaType === TmdbMediaTypeEnum.TV);

const tmdbGetMovieDetailsApi = useGetTmdbMovieDetailsApi(queries);
const tmdbGetRecommendationsApi = useGetTmdbRecommendationsApi(queries);
const tmdbGetMovieCreditsApi = useGetTmdbMovieCreditsApi(queries);
const tmdbGetVideosApi = useGetTmdbVideosApi(getVideosQueries);
const tmdbGetTvSeriesDetailsApi = useGetTmdbTvSeriesDetailsApi(queries, isTv);

await Promise.all([
  tmdbGetMovieDetailsApi.suspense().then((res) => {
    if ((res.error as Error)?.message.startsWith("404")) {
      throw createError({
        statusCode: 404,
        message: t("ui.errors.pageNotFound"),
      });
    }
  }),
  tmdbGetRecommendationsApi.suspense(),
  tmdbGetMovieCreditsApi.suspense(),
  tmdbGetVideosApi.suspense(),
  (isTv.value && tmdbGetTvSeriesDetailsApi.suspense()),
]);

useMovieDetailsSeo({
  credits: tmdbGetMovieCreditsApi.data.value,
  mediaId: props.mediaId,
  mediaType: props.mediaType,
  media: tmdbGetMovieDetailsApi.data.value,
});

const videosList = computed(() => {
  if (!tmdbGetVideosApi.data.value?.results.length) {
    return [];
  }

  return [...tmdbGetVideosApi.data.value.results].sort((a) => (a.type === "Trailer" || a.type === "Teaser" ? -1 : 1));
});

const castList = computed(() => {
  if (!tmdbGetMovieCreditsApi.data.value?.cast.length) {
    return [];
  }

  return tmdbGetMovieCreditsApi.data.value.cast.slice(0, 12);
})

const latestEpisodes = computed(() => {
  const seasons = tmdbGetTvSeriesDetailsApi.data.value;
  const lastEpisodeToAir = tmdbGetMovieDetailsApi.data.value?.last_episode_to_air;

  if (!seasons?.length || !lastEpisodeToAir) {
    return [];
  }

  const episodes = []
  const today = new Date();

  for (let i = lastEpisodeToAir.season_number; i >= 0; i--) {
    const season = seasons[i];

    for (let j = season?.episodes.length - 1; j >= 0; j--) {
      const episode = season?.episodes[j];

      if (episodes.length > 0 || episode?.air_date && new Date(episode?.air_date) < today) {
        episodes.push(episode);
      }
      if (episodes.length >= 20) {
        break;
      }
    }
    if (episodes.length >= 20) {
      break;
    }
  }

  return episodes;
});
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <MovieDetailsHeader
      :credits="tmdbGetMovieCreditsApi.data.value"
      :details="tmdbGetMovieDetailsApi.data.value"
      :mediaType="props.mediaType"
      :overview="tmdbGetMovieDetailsApi.data.value?.overview"
    />

    <UiSectionWithSeeMore
      v-if="latestEpisodes.length"
      :title="$t(`details.latestEpisodes`)"
      :see-more-url="localePath(`/details/${TmdbMediaTypeEnum.TV}/${props.mediaId}/seasons`)"
      :see-more-text="$t(`details.episodesList`)"
    >
      <UiSlider
        :data="latestEpisodes"
        :max-width="295"
        :buttons-top-offset="78"
      >
        <template #slide="{item}">
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
        <template #slide="{item}">
          <VideoCardWithPlayer
            full-height
            :title="item.name"
            :description="formatDate(item.published_at, locale)"
            :preview-src="`https://i.ytimg.com/vi/${item.key}/hq720.jpg`"
            :video-url="`https://www.youtube.com/embed/${item.key}?autoplay=1`"
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
      v-if="tmdbGetRecommendationsApi.data.value?.results.length"
      :title="$t(`details.recommendationsTitle`)"
      hide-see-more
    >
      <UiSlider
        :data="tmdbGetRecommendationsApi.data.value?.results"
        :max-width="195"
        :buttons-top-offset="142"
      >
        <template #slide="{item}">
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
@import "~/styles/variables";
@import "~/styles/mixins";

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

      .castItem:nth-child(n+10) {
        display: none;
      }
    }

    @include mobileDevice() {
      grid-template-columns: repeat(1, 1fr);
      column-gap: 48px;
      row-gap: 30px;

      .castItem:nth-child(n+7) {
        display: none;
      }
    }
  }
}
</style>
