<script setup lang="ts">
import type { TmdbMediaTypeEnum, TmdbSearchResponseResultItemType } from "@movie-tracker/types"
import { ref } from "vue"
import { MediaListSelectorModal } from "~/entities/mediaList"
import { MovieCard } from "~/entities/movieCard"
import MovieCardHoverMenu from "~/features/movieCardWithHoverMenu/ui/MovieCardHoverMenu.vue"
import { useAuth } from "~/shared/composables/useAuth"
import { useNavigateToSignInPage } from "~/shared/composables/useNavigateToSignInPage"
import { UiHoverCard } from "~/shared/ui/UiHoverCard"
import { UiIcon } from "~/shared/ui/UiIcon"

interface MovieCardWithHoverMenuProps {
  fullHeight?: boolean
  movie: TmdbSearchResponseResultItemType
  width?: number
}

const props = defineProps<MovieCardWithHoverMenuProps>()
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
  <MovieCard
    :full-height="props.fullHeight"
    v-bind="$attrs"
    :movie="props.movie"
  >
    <template #control>
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
          <MovieCardHoverMenu
            :media-type="props.movie.media_type as TmdbMediaTypeEnum"
            :media-id="props.movie.id"
            @on-add-to-list-click="onOpenButtonClicked"
          />
        </template>
      </UiHoverCard>

      <MediaListSelectorModal
        v-model="isOpenModal"
        hide-trigger
        :media-id="props.movie.id"
        :media-type="props.movie.media_type as TmdbMediaTypeEnum"
      />
    </template>
  </MovieCard>
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
