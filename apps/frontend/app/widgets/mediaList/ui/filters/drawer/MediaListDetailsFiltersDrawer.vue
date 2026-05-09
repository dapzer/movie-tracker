<script setup lang="ts">
import type { MediaListDetailsFilters } from "@/widgets/mediaList/ui/filters/MediaListDetailsFilters.vue"
import { useI18n } from "#imports"
import { computed, ref } from "vue"
import { UiBottomDrawer } from "@/shared/ui/UiBottomDrawer"
import { UiButton } from "@/shared/ui/UiButton"
import MediaListDetailsFiltersDrawerContent
  from "~/widgets/mediaList/ui/filters/drawer/MediaListDetailsFiltersDrawerContent.vue"

const RATING_MIN = 0
const RATING_MAX = 10

const { t } = useI18n()

const mediaTypesModel = defineModel<MediaListDetailsFilters["mediaTypes"]>("mediaTypes", { default: () => [] })
const ratingModel = defineModel<MediaListDetailsFilters["rating"]>("rating", { default: () => [RATING_MIN, RATING_MAX] })
const releaseYearModel = defineModel<MediaListDetailsFilters["releaseYear"]>("releaseYear", { default: () =>
  [undefined, undefined] })
const genresModel = defineModel<MediaListDetailsFilters["genres"]>("genres", { default: () => [] })

const isDrawerOpen = ref(false)

const isFiltersActive = computed(() => {
  return mediaTypesModel.value.length > 0
    || genresModel.value.length > 0
    || releaseYearModel.value[0] !== undefined
    || releaseYearModel.value[1] !== undefined
    || ratingModel.value[0] > RATING_MIN
    || ratingModel.value[1] < RATING_MAX
})
</script>

<template>
  <UiButton
    :class="$style.trigger"
    variant="boxed"
    :scheme="isFiltersActive ? 'secondary-light' : 'medium-gray'"
    with-icon
    @click="isDrawerOpen = true"
  >
    {{ t("mediaList.filters.title") }}
  </UiButton>

  <UiBottomDrawer
    v-model="isDrawerOpen"
    :title="t('mediaList.filters.title')"
    :content-class="$style.content"
  >
    <template #content>
      <MediaListDetailsFiltersDrawerContent
        v-model:media-types="mediaTypesModel"
        v-model:rating="ratingModel"
        v-model:release-year="releaseYearModel"
        v-model:genres="genresModel"
      />
    </template>
  </UiBottomDrawer>
</template>

<style module lang="scss">
.trigger {
  width: 100%;
  justify-content: center;
  border-radius: var(--s-border-radius-super-mega-huge);
  font-size: var(--fs-label-small);
}

.content {
  overflow: unset;
}
</style>
