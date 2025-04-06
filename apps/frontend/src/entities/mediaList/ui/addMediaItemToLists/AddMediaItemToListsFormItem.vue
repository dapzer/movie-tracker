<script setup lang="ts">
import type { MediaListType } from "@movie-tracker/types"
import { computed } from "vue"
import { UiFormListItem } from "~/shared/ui/UiFormListItem"
import { UiIcon } from "~/shared/ui/UiIcon"
import { getElementDeclensionTranslationKey } from "~/shared/utils/getElementDeclensionTranslationKey"

interface AddMediaItemToListsFormItemProps {
  mediaList: MediaListType
}

const props = defineProps<AddMediaItemToListsFormItemProps>()
const model = defineModel<boolean>()

const titlesInListCount = computed(() => {
  return props.mediaList.mediaItemsCount || 0
})
</script>

<template>
  <UiFormListItem
    v-model="model"
    :title="props.mediaList.title ?? $t('mediaList.favorites')"
    :description="`${titlesInListCount} ${$t(getElementDeclensionTranslationKey(titlesInListCount))}`"
  >
    <template #rightContent>
      <UiIcon
        v-if="props.mediaList.isPublic"
        block
        name="icon:shared-planet"
        :size="20"
      />
      <UiIcon
        v-else
        block
        name="icon:locker"
        :size="20"
      />
    </template>
  </UiFormListItem>
</template>

<style module lang="scss">
</style>
