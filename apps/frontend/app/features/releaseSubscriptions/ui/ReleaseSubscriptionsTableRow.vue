<script setup lang="ts">
import type { MediaDetailsInfoSeasonEpisodeType, ReleaseSubscriptionWithDetailsType } from "@movie-tracker/types"
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { MediaTypeEnum } from "@movie-tracker/types"
import { computed } from "vue"
import { ReleaseSubscriptionButton } from "~/features/releaseSubscriptions"
import { UiImage } from "~/shared/ui/UiImage"
import { UiTableCell, UiTableRow } from "~/shared/ui/UiTable"
import { UiTypography } from "~/shared/ui/UiTypography"
import { getCurrentMediaDetails } from "~/shared/utils/getCurrentMediaDetails"
import { getProxiedImageUrl } from "~/shared/utils/getProxiedImageUrl"
import { getTimeSinceDate } from "~/shared/utils/getTimeSinceDate"

interface ReleaseSubscriptionsTableRowProps {
  subscription: ReleaseSubscriptionWithDetailsType
}

const props = defineProps<ReleaseSubscriptionsTableRowProps>()
const { locale } = useI18n()
const localePath = useLocalePath()

const details = computed(() => {
  return getCurrentMediaDetails(props.subscription.mediaDetails, locale.value)
})

const mediaDetailsUrl = computed(() => {
  return localePath(`/details/${props.subscription.mediaType}/${props.subscription.mediaId}`)
})

const mediaDetailsSeasonsUrl = computed(() => {
  return localePath(`/details/${props.subscription.mediaType}/${props.subscription.mediaId}/seasons`)
})

const lastRelease = computed(() => {
  if (props.subscription.mediaType === MediaTypeEnum.MOVIE) {
    return undefined
  }

  const seasons = details.value?.seasons
  if (!seasons?.length) {
    return undefined
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let latestEpisode: MediaDetailsInfoSeasonEpisodeType | undefined

  for (const season of seasons) {
    for (const episode of season.episodes || []) {
      if (!episode.airDate) {
        continue
      }

      const episodeAirDate = new Date(episode.airDate)
      episodeAirDate.setHours(0, 0, 0, 0)

      if (episodeAirDate <= today) {
        latestEpisode = episode
      }
      else if (episodeAirDate > today) {
        return latestEpisode
      }
    }
  }
  return latestEpisode
})
</script>

<template>
  <UiTableRow>
    <UiTableCell>
      <div :class="$style.info">
        <NuxtLink :to="mediaDetailsUrl">
          <UiImage
            :class="$style.poster"
            width="42"
            height="64"
            :alt="`${details?.originalTitle} poster`"
            :src="getProxiedImageUrl(details?.poster, 100)"
          />
        </NuxtLink>

        <UiTypography
          variant="label"
          :as="NuxtLink"
          :to="mediaDetailsUrl"
        >
          {{ details?.title }}
        </UiTypography>
      </div>
    </UiTableCell>
    <UiTableCell>
      <div
        v-if="lastRelease"
        :class="$style.episode"
      >
        <NuxtLink :to="mediaDetailsSeasonsUrl">
          <UiImage
            :class="$style.episodePoster"
            :src="getProxiedImageUrl(lastRelease.poster, 100)"
            height="44"
            width="80"
          />
        </NuxtLink>
        <div>
          <UiTypography
            :as="NuxtLink"
            :to="mediaDetailsSeasonsUrl"
            variant="cardTitle"
            :class="$style.episodeTitle"
          >
            S{{ lastRelease.seasonNumber }}.E{{ lastRelease.episodeNumber }} ∙ {{ lastRelease.name }}
          </UiTypography>
          <UiTypography
            :class="$style.episodeAirDate"
            variant="description"
            data-allow-mismatch
          >
            {{ getTimeSinceDate(lastRelease.airDate, locale) }}
          </UiTypography>
        </div>
      </div>
      <UiTypography
        v-else
        variant="description"
      >
        —
      </UiTypography>
    </UiTableCell>
    <UiTableCell align="right">
      <ReleaseSubscriptionButton
        :media-id="props.subscription.mediaId"
        :media-type="props.subscription.mediaType"
        :subscription="props.subscription"
      />
    </UiTableCell>
  </UiTableRow>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";

.info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.poster {
  border-radius: var(--s-border-radius-small);
  width: 42px;
  height: 64px;
  object-fit: cover;
}

.episode {
  display: flex;
  gap: 16px;
}

.episodePoster {
  width: 80px;
  height: 44px;
  border-radius: var(--s-border-radius-small);
  object-fit: cover;
}

.episodeTitle {
  margin-bottom: 4px;
  @include ellipsisText();
}
</style>
