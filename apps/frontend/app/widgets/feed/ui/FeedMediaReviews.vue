<script setup lang="ts">
import type { MediaReview } from "@movie-tracker/types"
import { useLocalePath } from "#i18n"
import { MediaReviewCardCompact, MediaReviewCardCompactSkeleton } from "~/entities/mediaReview"
import { UiSectionWithSeeMore } from "~/shared/ui/UiSectionWithSeeMore"
import FeedSlider from "~/widgets/feed/ui/FeedSlider.vue"

interface FeedMediaReviewsProps {
  mediaReviews?: MediaReview[]
  isLoading: boolean
}

const props = defineProps<FeedMediaReviewsProps>()

const localePath = useLocalePath()
</script>

<template>
  <UiSectionWithSeeMore
    title-as="h2"
    :title="$t('feed.recentReviews')"
    :see-more-url="localePath('/reviews/recent')"
    see-more-align="end"
  >
    <FeedSlider
      :data="props.mediaReviews"
      :skeletons-count="3"
      :is-loading="props.isLoading"
      :slide-width="386"
    >
      <template #slide="{ item }">
        <MediaReviewCardCompact
          :class="$style.card"
          :media-review="item"
        />
      </template>

      <template #skeleton>
        <MediaReviewCardCompactSkeleton :class="$style.card" />
      </template>
    </FeedSlider>
  </UiSectionWithSeeMore>
</template>

<style module lang="scss">
.card {
  height: 100%;
}
</style>
