<script setup lang="ts">
import type { MediaTypeEnum, TmdbMediaTypeEnum } from "@movie-tracker/types"
import { ref } from "vue"
import { MediaListSelectorModal } from "~/entities/mediaList"
import MovieHoverMenuContent from "~/entities/movieHoverMenu/ui/MovieHoverMenuContent.vue"
import { useAuth } from "~/shared/composables/useAuth"
import { useNavigateToSignInPage } from "~/shared/composables/useNavigateToSignInPage"
import { UiHoverCard } from "~/shared/ui/UiHoverCard"
import { UiIcon } from "~/shared/ui/UiIcon"

interface MovieHoverMenuProps {
  mediaId: number
  mediaType: MediaTypeEnum | TmdbMediaTypeEnum
}

const props = defineProps<MovieHoverMenuProps>()

const isOpenModal = ref(false)
const { isAuthorized } = useAuth()
const { navigateToSignInPage } = useNavigateToSignInPage()

function onOpenButtonClicked() {
  if (!isAuthorized.value) {
    navigateToSignInPage()
    return
  }

  isOpenModal.value = true
}
</script>

<template>
  <UiHoverCard
    :indent="0"
    :class="$style.trigger"
    align="start"
    side="right"
  >
    <template #trigger>
      <UiIcon
        :class="$style.icon"
        name="icon:details"
        :size="20"
      />
    </template>

    <template #content>
      <MovieHoverMenuContent
        :media-type="props.mediaType as TmdbMediaTypeEnum"
        :media-id="props.mediaId"
        @on-add-to-list-click="onOpenButtonClicked"
      />
    </template>
  </UiHoverCard>

  <MediaListSelectorModal
    v-model="isOpenModal"
    hide-trigger
    :media-type="props.mediaType as TmdbMediaTypeEnum"
    :media-id="props.mediaId"
  />
</template>

<style module lang="scss">
@import "~/shared/styles/breakpoints";
@import "~/shared/styles/mixins";

.trigger {
  cursor: pointer;
  position: absolute;
  top: 8px;
  width: fit-content;
  right: 16px;
  z-index: 1;
  mix-blend-mode: difference;

  .icon {
    margin-top: 8px;
  }

  &:not(:hover) {
    opacity: 0.5;
  }

  @include mobileDevice() {
    display: none;
  }
}
</style>
