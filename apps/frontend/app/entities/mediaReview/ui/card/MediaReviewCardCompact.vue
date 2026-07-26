<script setup lang="ts">
import type { MediaReview } from "@movie-tracker/types"
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { MediaReviewCardMediaNameLink } from "~/entities/mediaReview"
import MediaReviewCardRate from "~/entities/mediaReview/ui/card/MediaReviewCardRate.vue"
import { UiAvatar } from "~/shared/ui/UiAvatar"
import { UiSpoilerText } from "~/shared/ui/UiSpoilerText"
import { UiTrimmedText } from "~/shared/ui/UiTrimmedText"
import { UiTypography } from "~/shared/ui/UiTypography"
import { formatDate } from "~/shared/utils/formatDate"

interface MediaReviewCardBaseProps {
  mediaReview: MediaReview
}

const props = defineProps<MediaReviewCardBaseProps>()
const localePath = useLocalePath()
const { locale } = useI18n()
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.header">
      <NuxtLink
        :class="$style.user"
        :to="localePath(`/profile/${props.mediaReview.user?.id}`)"
      >
        <UiAvatar
          :size="32"
          :src="props.mediaReview.user?.image"
          :placeholder-id="props.mediaReview.user?.id"
          :alt="props.mediaReview.user?.name"
        />
        <UiTypography
          :class="$style.userName"
          variant="cardTitle"
        >
          {{ props.mediaReview.user?.name }}
        </UiTypography>
      </NuxtLink>

      <UiTypography
        v-if="props.mediaReview.publishedAt"
        variant="description"
      >
        {{ formatDate(props.mediaReview.publishedAt, locale) }}
      </UiTypography>
    </div>
    <div :class="$style.content">
      <UiTypography
        v-if="props.mediaReview.title"
        variant="subheading"
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
        :expandable="false"
        without-shadow
      />
      <MediaReviewCardRate :rating="props.mediaReview.rating" />
    </div>

    <MediaReviewCardMediaNameLink
      :class="$style.link"
      :review="props.mediaReview"
    />
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";
@import "~/shared/styles/variables";

.wrapper {
  display: flex;
  padding: 20px;
  background-color: var(--c-review-card-background);
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.userName {
  @include ellipsisText();
}

.content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.text {
  white-space: pre-wrap;
}

.link {
  margin-top: auto;
}
</style>
