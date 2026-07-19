<script setup lang="ts">
import type { MediaReview } from "@movie-tracker/types"
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { computed } from "vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"
import { getCurrentMediaDetails } from "~/shared/utils/getCurrentMediaDetails"

interface MediaReviewCardMediaNameLinkProps {
  review: MediaReview
}

const props = defineProps<MediaReviewCardMediaNameLinkProps>()
const localePath = useLocalePath()
const { locale } = useI18n()

const details = computed(() => {
  return getCurrentMediaDetails(props.review.mediaDetails, locale.value)
})
</script>

<template>
  <UiButton
    with-icon
    variant="text"
    scheme="link"
    :as="NuxtLink"
    :to="localePath(`/reviews/details/${props.review.id}`)"
  >
    {{ details?.title || details?.originalTitle }}
    <UiIcon
      name="icon:arrow-right-bold"
      :size="20"
    />
  </UiButton>
</template>

<style scoped lang="scss">

</style>
