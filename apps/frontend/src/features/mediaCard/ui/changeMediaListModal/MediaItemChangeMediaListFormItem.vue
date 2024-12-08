<script setup lang="ts">
import { useGetMediaItemsApi } from "~/api/mediaItem/useMediaItemtApi"
import { type MediaListType } from "@movie-tracker/types"
import { computed } from "vue"
import { LockerIcon, SharedPlanetIcon } from "~/components/ui/icons"
import { getElementDeclensionTranslationKey } from "~/utils/getElementDeclensionTranslationKey"
import { UiFormListItem } from "~/components/ui/UiFormListItem"

interface MediaItemChangeMediaListFormItemProps {
  mediaList: MediaListType;
  radio?: boolean;
}

const props = defineProps<MediaItemChangeMediaListFormItemProps>();
const model = defineModel()

const getMediaItemsApi = useGetMediaItemsApi();

const titlesInListCount = computed(() => {
  return getMediaItemsApi.data.value?.filter(item => {
    return item.mediaListId === props.mediaList.id
  }).length || 0
})
</script>

<template>
  <UiFormListItem
    v-model="model"
    :radio="props.radio"
    :title="props.mediaList.title ?? $t('mediaList.favorites')"
    :description="titlesInListCount + ' ' + $t(getElementDeclensionTranslationKey(titlesInListCount))"
  >
    <template #rightContent>
      <SharedPlanetIcon
        v-if="props.mediaList.isPublic"
        :class="$style.svg"
      />
      <LockerIcon
        v-else
        :class="$style.svg"
      />
    </template>
  </UiFormListItem>
</template>

<style module lang="scss">
.svg {
  width: 20px;
}
</style>
