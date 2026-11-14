<script setup lang="ts">
import type { TvEpisodeWatchType } from "@movie-tracker/types"
import { computed, ref } from "vue"
import MediaCardManagementMenuTvProgressEpisodeRatingForm
  from "~/features/mediaCard/ui/managementMenu/tvProgress/MediaCardManagementMenuTvProgressEpisodeRatingForm.vue"
import { useIsMobile } from "~/shared/composables/useIsMobile"
import { UiBottomDrawer } from "~/shared/ui/UiBottomDrawer"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiModal } from "~/shared/ui/UiModal"

interface MediaCardManagementMenuTvProgressEpisodeRatingProps {
  episodeWatch: TvEpisodeWatchType
  title: string
}

const props = defineProps<MediaCardManagementMenuTvProgressEpisodeRatingProps>()
const isOpenModal = ref(false)
const { isMobile } = useIsMobile()
const hasRating = computed(() => props.episodeWatch.rating !== null)
</script>

<template>
  <UiButton
    :class="$style.trigger"
    variant="textIcon"
    :aria-label="`${$t('mediaRating.rate')}: ${props.title}`"
    @click="isOpenModal = true"
  >
    <UiIcon
      :name="hasRating ? 'icon:rating-star-filled' : 'icon:rating-star'"
      :size="16"
      block
    />
    <span v-if="hasRating">{{ props.episodeWatch.rating }}</span>
  </UiButton>

  <ClientOnly>
    <UiModal
      v-if="isOpenModal && !isMobile"
      v-model="isOpenModal"
      without-header
      :max-width="456"
    >
      <template #content>
        <MediaCardManagementMenuTvProgressEpisodeRatingForm
          :title="props.title"
          :episode-watch="props.episodeWatch"
          @after-submit="isOpenModal = false"
        />
      </template>
    </UiModal>
    <UiBottomDrawer
      v-else-if="isOpenModal"
      v-model="isOpenModal"
    >
      <template #content>
        <MediaCardManagementMenuTvProgressEpisodeRatingForm
          :title="props.title"
          :episode-watch="props.episodeWatch"
          @after-submit="isOpenModal = false"
        />
      </template>
    </UiBottomDrawer>
  </ClientOnly>
</template>

<style module lang="scss">
.trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 2px;
  color: var(--c-gold);
}
</style>
