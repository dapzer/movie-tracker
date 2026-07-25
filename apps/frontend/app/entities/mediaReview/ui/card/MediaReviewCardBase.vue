<script setup lang="ts">
import type { MediaReview } from "@movie-tracker/types"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { computed } from "vue"
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

const userProfileUrl = computed(() => {
  return localePath(`/profile/${props.mediaReview.user?.id}`)
})
</script>

<template>
  <div :class="$style.wrapper">
    <NuxtLink
      :class="$style.avatarPc"
      :to="userProfileUrl"
    >
      <UiAvatar
        :size="44"
        :src="props.mediaReview.user?.image"
        :placeholder-id="props.mediaReview.user?.id"
        :alt="props.mediaReview.user?.name"
      />
    </NuxtLink>
    <div :class="$style.body">
      <div :class="$style.header">
        <NuxtLink
          :class="$style.user"
          :to="userProfileUrl"
        >
          <UiAvatar
            :class="$style.avatarMobile"
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

      <slot name="footer" />
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

.avatarMobile {
  display: none;
}

@include mobileDevice() {
  .avatarPc {
    display: none;
  }

  .avatarMobile {
    display: flex;
  }
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

.body {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
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
</style>
