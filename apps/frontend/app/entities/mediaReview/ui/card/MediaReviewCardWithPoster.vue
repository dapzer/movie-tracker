<script setup lang="ts">
import type { MediaReview } from "@movie-tracker/types"
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { computed, useI18n } from "#imports"
import MediaReviewCardActions from "~/entities/mediaReview/ui/card/MediaReviewCardActions.vue"
import MediaReviewCardRate from "~/entities/mediaReview/ui/card/MediaReviewCardRate.vue"
import MediaReviewCardVotes from "~/entities/mediaReview/ui/card/MediaReviewCardVotes.vue"
import { MovieHoverMenu } from "~/entities/movieHoverMenu"
import { UiImage } from "~/shared/ui/UiImage"
import { UiRating } from "~/shared/ui/UiRating"
import { UiSpoilerText } from "~/shared/ui/UiSpoilerText"
import { UiTrimmedText } from "~/shared/ui/UiTrimmedText"
import { UiTypography } from "~/shared/ui/UiTypography"
import { formatDate } from "~/shared/utils/formatDate"
import { getCurrentMediaDetails } from "~/shared/utils/getCurrentMediaDetails"
import { getProxiedImageUrl } from "~/shared/utils/getProxiedImageUrl"

interface MediaReviewCardWithPosterProps {
  mediaReview: MediaReview
  hideReviewPageLink?: boolean
}

const props = defineProps<MediaReviewCardWithPosterProps>()
const localePath = useLocalePath()
const { locale } = useI18n()

const details = computed(() => {
  return getCurrentMediaDetails(props.mediaReview.mediaDetails, locale.value)
})

const mediaTitle = computed(() => {
  return details.value?.title || details.value?.originalTitle
})

const mediaDetailsUrl = computed(() => {
  return localePath(`/details/${props.mediaReview.mediaType}/${props.mediaReview.mediaId}`)
})
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.posterWrapper">
      <NuxtLink
        :class="$style.posterLink"
        :to="mediaDetailsUrl"
      >
        <UiImage
          :class="$style.poster"
          :src="getProxiedImageUrl(details?.poster, 179)"
          fallback-src="/defaultMoviePoster.svg"
        />
      </NuxtLink>
      <div :class="$style.posterOverlay">
        <UiRating
          :class="$style.rating"
          :value="props.mediaReview?.mediaDetails?.score"
        />
        <div>
          <MovieHoverMenu
            :class="$style.hoverMenu"
            :media-id="props.mediaReview.mediaId"
            :media-type="props.mediaReview.mediaType"
          />
        </div>
      </div>
    </div>

    <div :class="$style.body">
      <div :class="$style.header">
        <UiTypography
          :as="NuxtLink"
          :to="mediaDetailsUrl"
          :class="$style.titleText"
          variant="cardTitle"
        >
          {{ mediaTitle }}
        </UiTypography>

        <UiTypography
          v-if="props.mediaReview.publishedAt"
          variant="description"
          :class="$style.publishedAt"
        >
          {{ formatDate(props.mediaReview.publishedAt, locale) }}
        </UiTypography>
      </div>

      <div :class="$style.content">
        <UiTypography
          v-if="props.mediaReview.title"
          variant="listTitle"
        >
          {{ props.mediaReview.title }}
        </UiTypography>
        <UiTrimmedText
          :as="UiSpoilerText"
          :class="$style.text"
          :text="props.mediaReview.content"
          :max-lines="5"
          :max-chars-in-line="109"
          :disabled="!props.mediaReview.isSpoiler"
        />
        <MediaReviewCardRate :rating="props.mediaReview.rating" />
      </div>

      <div :class="$style.footer">
        <MediaReviewCardVotes :media-review="props.mediaReview" />
        <MediaReviewCardActions
          :hide-page-link="props.hideReviewPageLink"
          :media-review="props.mediaReview"
        />
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";
@import "~/shared/styles/variables";

.wrapper {
  display: flex;
  gap: 16px;
  padding: 20px;
  background-color: var(--c-review-card-background);
}

.posterWrapper {
  position: relative;
  width: 100%;
  max-width: 129px;

  @include mobileDevice() {
    display: none;
  }
}

.posterOverlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 6px;
  display: flex;
  justify-content: space-between;

  .hoverMenu {
    position: unset;

    span {
      margin-top: unset;
    }
  }
}

.posterLink {
  display: block;
}

.poster {
  aspect-ratio: 2/3;
  border-radius: 4px;
  object-fit: cover;
}

.body {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.titleText {
  @include ellipsisText();
}

.publishedAt {
  white-space: nowrap;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .text {
    white-space: pre-wrap;
    color: var(--c-description);
  }
}

.footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  @include mobileDevice() {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}
</style>
