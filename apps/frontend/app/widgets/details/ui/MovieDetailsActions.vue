<script setup lang="ts">
import type { MediaTypeEnum, TmdbMediaTypeEnum } from "@movie-tracker/types"
import { MediaListSelectorModal } from "~/entities/mediaList"
import { MediaDetailsReleaseSubscription } from "~/entities/releaseSubscription"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"
import MediaDetailsRatingSelector from "~/widgets/details/ui/MediaDetailsRatingSelector.vue"

interface MovieDetailsActionsProps {
  mediaId: number
  mediaType: TmdbMediaTypeEnum | MediaTypeEnum
  hideRating?: boolean
  title?: string
  releaseDate?: string
}

const props = defineProps<MovieDetailsActionsProps>()
</script>

<template>
  <div :class="$style.wrapper">
    <MediaListSelectorModal
      :media-id="props.mediaId"
      :media-type="props.mediaType"
    />
    <MediaDetailsRatingSelector
      v-if="!props.hideRating"
      :title="props.title"
      :media-id="props.mediaId"
      :media-type="props.mediaType"
    />
    <MediaDetailsReleaseSubscription
      :title="props.title"
      :release-date="props.releaseDate"
      :media-id="props.mediaId"
      :media-type="props.mediaType"
    >
      <template #default="{ subscription, isPending, isDisabled, handleSubscribeClick }">
        <UiButton
          :scheme="subscription ? 'light-gray' : 'primary'"
          :variant="subscription ? 'boxed' : 'outlined'"
          size="medium"
          with-icon
          :disabled="isDisabled || isPending"
          @click="handleSubscribeClick"
        >
          <UiIcon
            v-if="!subscription"
            name="icon:bell-outlined"
            :size="20"
          />
          <UiIcon
            v-else
            name="icon:bell"
            :size="16"
          />
          {{ subscription ? $t("releaseSubscription.unsubscribe") : $t("releaseSubscription.subscribe") }}
        </UiButton>
      </template>
    </MediaDetailsReleaseSubscription>
  </div>
</template>

<style module lang="scss">
@use "~/shared/styles/breakpoints" as *;
@use "~/shared/styles/mixins" as *;

@layer ui, external;

@layer ui {
  .wrapper {
    height: fit-content;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;

    button:not(:last-child) {
      margin-bottom: 8px;
    }

    @include mobileDevice() {
      &,
      button {
        width: 100%;
      }
    }
  }
}
</style>
