<script lang="ts" setup>
import type { MediaRatingType, UserPublicType } from "@movie-tracker/types"
import { useLocalePath } from "#i18n"
import { computed, useI18n } from "#imports"
import { UiAvatar } from "~/shared/ui/UiAvatar"
import { UiMediaCard } from "~/shared/ui/UiCard"
import { UiRating } from "~/shared/ui/UiRating"
import { formatDate } from "~/shared/utils/formatDate"
import { getCurrentMediaDetails } from "~/shared/utils/getCurrentMediaDetails"
import { getProxiedImageUrl } from "~/shared/utils/getProxiedImageUrl"

export interface MediaRatingCardProps {
  mediaRating: MediaRatingType
  user: UserPublicType
  width?: number
  fullHeight?: boolean
}

const props = defineProps<MediaRatingCardProps>()

const localePath = useLocalePath()
const { locale } = useI18n()

const createdDate = computed(() => {
  return formatDate(props.mediaRating.createdAt, locale.value)
})

const details = computed(() => {
  return getCurrentMediaDetails(props.mediaRating.mediaDetails, locale.value)
})
</script>

<template>
  <UiMediaCard
    :class="$style.wrapper"
    :title="(details?.title || details?.originalTitle)!"
    :description="createdDate"
    :image-src="getProxiedImageUrl(details?.poster, 360)"
    :link-url="localePath(`/details/${props.mediaRating.mediaType}/${props.mediaRating.mediaId}`)"
    :width="props.width"
    :full-height="props.fullHeight"
    fallback-image-src="/defaultMoviePoster.svg"
  >
    <template #content>
      <UiRating
        :class="$style.rating"
        :value="props.mediaRating?.rating"
      >
        <template #beforeContent>
          <NuxtLink
            :to="localePath(`/profile/${props.user.id}`)"
          >
            <UiAvatar
              :size="16"
              :src="props.user?.image"
              :placeholder-id="props.user?.id"
              :alt="`${props.user?.name} avatar`"
            />
          </NuxtLink>
        </template>
      </UiRating>
    </template>
    <template #control>
      <slot name="control" />
    </template>
  </UiMediaCard>
</template>

<style lang="scss" module>
.wrapper {
  position: relative;

  .rating {
    gap: 6px;

    position: absolute;
    top: 14px;
    left: 14px;
  }
}
</style>
