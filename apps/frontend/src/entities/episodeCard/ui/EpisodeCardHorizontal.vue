<script lang="ts" setup>
import type { TmdbSeasonDetailsEpisodeType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed } from "vue"
import { UiCardBase } from "~/shared/ui/UiCard"
import { UiImage } from "~/shared/ui/UiImage"
import { UiSpoilerText } from "~/shared/ui/UiSpoilerText"
import { UiTypography } from "~/shared/ui/UiTypography"
import { UiVoteWithRuntime } from "~/shared/ui/UiVoteWithRuntime"
import { formatDate } from "~/shared/utils/formatDate"
import { getProxiedImageUrl } from "~/shared/utils/getProxiedImageUrl"

interface EpisodeCardHorizontalProps {
  width?: number
  episode: TmdbSeasonDetailsEpisodeType
}

const props = withDefaults(defineProps<EpisodeCardHorizontalProps>(), {})
const { locale } = useI18n()

const episodeTitle = computed(() =>
  `S${props.episode.season_number}.E${props.episode.episode_number} ∙ ${props.episode.name}`)
</script>

<template>
  <UiCardBase
    horizontal
    :class="$style.wrapper"
    :width="props.width"
    :image-width="180"
  >
    <template #image>
      <UiImage
        :class="$style.image"
        :src="getProxiedImageUrl(props.episode?.still_path, 300)"
        fallback-src="/defaultMoviePoster.svg"
        height="183"
        width="300"
      />
    </template>

    <template #content>
      <div :class="$style.content">
        <div :class="$style.header">
          <UiTypography
            :class="$style.title"
            variant="cardTitle"
          >
            {{ episodeTitle }}
          </UiTypography>
          <UiTypography
            :class="$style.date"
            variant="description"
            data-allow-mismatch
          >
            {{ formatDate(props.episode.air_date, locale) }}
          </UiTypography>
        </div>

        <div :class="$style.details">
          <UiVoteWithRuntime
            :vote-average="props.episode.vote_average"
            :vote-count="props.episode.vote_count"
            :runtime="props.episode.runtime"
          />
        </div>

        <UiSpoilerText>
          <UiTypography
            :class="$style.description"
            variant="description"
          >
            {{ props.episode.overview }}
          </UiTypography>
        </UiSpoilerText>
      </div>
    </template>
  </UiCardBase>
</template>

<style lang="scss" module>
@import "~/shared/styles/mixins";
@import "~/shared/styles/breakpoints";

.wrapper {
  & > div:nth-child(2) {
    min-width: 0;
  }

  .image {
    flex: 1 1 auto;
    object-fit: cover;
    aspect-ratio: 16 / 9;
  }

  .content {
    display: flex;
    gap: 4px;
    flex-direction: column;
    min-width: 0;

    .header {
      display: flex;
      min-width: 0;
      gap: 8px;
      justify-content: space-between;
    }

    .title {
      @include ellipsisText;
    }

    .date {
      white-space: nowrap;
    }

    .description {
      margin-top: 6px;
    }
  }

  @include mobileDevice() {
    flex-direction: column;
    --imageMaxWidth: 100% !important;
  }
}
</style>
