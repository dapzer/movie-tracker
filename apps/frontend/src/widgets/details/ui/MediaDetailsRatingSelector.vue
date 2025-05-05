<script setup lang="ts">
import type { MediaTypeEnum, TmdbMediaTypeEnum } from "@movie-tracker/types"
import type { UiButtonScheme, UiButtonVariant } from "~/shared/ui/UiButton"
import { computed } from "vue"
import { useGetMediaRatingByUserApi } from "~/api/mediaRating/useMediaRatingApi"
import { MediaRatingSelectModal } from "~/entities/mediaRating"
import { useAuth } from "~/shared/composables/useAuth"
import { useNavigateToSignInPage } from "~/shared/composables/useNavigateToSignInPage"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"

interface MediaDetailsRatingSelectorProps {
  mediaId: number
  mediaType: TmdbMediaTypeEnum | MediaTypeEnum
  title?: string
}

const props = defineProps<MediaDetailsRatingSelectorProps>()

const { isAuthorized } = useAuth()
const { navigateToSignInPage } = useNavigateToSignInPage()

const getMediaRatingApi = useGetMediaRatingByUserApi({
  mediaId: props.mediaId,
  mediaType: props.mediaType as unknown as MediaTypeEnum,
})

const scheme = computed<UiButtonScheme>(() => {
  return getMediaRatingApi.data.value?.rating ? "gold" : "primary"
})

const variant = computed<UiButtonVariant>(() => {
  return getMediaRatingApi.data.value ? "boxed" : "outlined"
})
</script>

<template>
  <MediaRatingSelectModal
    :media-id="props.mediaId"
    :media-type="props.mediaType"
    :current-rating="getMediaRatingApi.data.value"
    :title="props.title!"
  >
    <template #trigger="{ openModal }">
      <UiButton
        :scheme="scheme"
        :variant="variant"
        size="medium"
        with-icon
        @click="isAuthorized ? openModal() : navigateToSignInPage()"
      >
        <UiIcon
          :class="[{
            [$style.icon]: !getMediaRatingApi.data.value?.rating,
          }]"
          :name="getMediaRatingApi.data.value?.rating ? 'icon:rating-star-filled' : 'icon:rating-star'"
          :size="18"
        />
        {{ getMediaRatingApi.data.value?.rating || $t("mediaRating.rate") }}
      </UiButton>
    </template>
  </MediaRatingSelectModal>
</template>

<style module lang="scss">
.icon {
  color: var(--c-description);
}
</style>
