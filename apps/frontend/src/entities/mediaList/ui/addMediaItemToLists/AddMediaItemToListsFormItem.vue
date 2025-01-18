<script setup lang="ts">
import { type MediaListType } from "@movie-tracker/types"
import { computed } from "vue"
import { LockerIcon, SharedPlanetIcon } from "~/components/ui/icons"
import { getElementDeclensionTranslationKey } from "~/utils/getElementDeclensionTranslationKey"
import { UiFormListItem } from "~/components/ui/UiFormListItem"

interface AddMediaItemToListsFormItemProps {
  mediaList: MediaListType;
}

const props = defineProps<AddMediaItemToListsFormItemProps>();
const model = defineModel<boolean>()

const titlesInListCount = computed(() => {
  return props.mediaList.mediaItemsCount || 0
})
</script>

<template>
  <UiFormListItem
    v-model="model"
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
