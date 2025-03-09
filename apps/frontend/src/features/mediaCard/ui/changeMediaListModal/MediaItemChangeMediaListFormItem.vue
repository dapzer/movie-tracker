<script setup lang="ts">
import type { MediaListType } from "@movie-tracker/types"
import { computed } from "vue"
import { useGetMediaItemsApi } from "~/api/mediaItem/useMediaItemtApi"
import { getElementDeclensionTranslationKey } from "~/utils/getElementDeclensionTranslationKey"
import { UiFormListItem } from "../~/shared/ui/UiFormListItem"
import { UiIcon } from "../~/shared/ui/UiIcon"

interface MediaItemChangeMediaListFormItemProps {
  mediaList: MediaListType
  radio?: boolean
}

const props = defineProps<MediaItemChangeMediaListFormItemProps>()
const model = defineModel()

const getMediaItemsApi = useGetMediaItemsApi()

const titlesInListCount = computed(() => {
  return getMediaItemsApi.data.value?.filter((item) => {
    return item.mediaListId === props.mediaList.id
  }).length || 0
})
</script>

<template>
  <UiFormListItem
    v-model="model"
    :radio="props.radio"
    :title="props.mediaList.title ?? $t('mediaList.favorites')"
    :description="`${titlesInListCount} ${$t(getElementDeclensionTranslationKey(titlesInListCount))}`"
  >
    <template #rightContent>
      <UiIcon
        v-if="props.mediaList.isPublic"
        name="icon:shared-planet"
        :size="20"
      />
      <UiIcon
        v-else
        name="icon:locker"
        :size="20"
      />
    </template>
  </UiFormListItem>
</template>

<style module lang="scss">
</style>
