<script setup lang="ts">
import type { MediaItemStatusNameEnum, MediaListType } from "@movie-tracker/types"
import { MediaListAccessLevelEnum } from "@movie-tracker/types"
import { computed } from "vue"
import AddMediaItemToListsStatusSelector
  from "~/entities/mediaList/ui/addMediaItemToLists/AddMediaItemToListsStatusSelector.vue"
import { UiFormListItem } from "~/shared/ui/UiFormListItem"
import { UiIcon } from "~/shared/ui/UiIcon"
import { getElementDeclensionTranslationKey } from "~/shared/utils/getElementDeclensionTranslationKey"

interface AddMediaItemToListsFormItemProps {
  mediaList: MediaListType
  currentStatus: MediaItemStatusNameEnum
}

const props = defineProps<AddMediaItemToListsFormItemProps>()
const emits = defineEmits<{
  (e: "onStatusChange", status: MediaItemStatusNameEnum): void
}>()
const model = defineModel<boolean>()

const titlesInListCount = computed(() => {
  return props.mediaList.mediaItemsCount || 0
})
</script>

<template>
  <UiFormListItem
    v-model="model"
    :wrapper-class="$style.wrapper"
    :title="props.mediaList.title ?? $t('mediaList.favorites')"
    :description="!model ? `${titlesInListCount} ${$t(getElementDeclensionTranslationKey(titlesInListCount))}` : ''"
  >
    <template #rightContent>
      <template v-if="!model">
        <UiIcon
          v-if="props.mediaList.accessLevel === MediaListAccessLevelEnum.PUBLIC"
          block
          name="icon:shared-planet"
          :size="20"
        />
        <UiIcon
          v-else-if="props.mediaList.accessLevel === MediaListAccessLevelEnum.URL"
          block
          name="icon:link"
          :size="16"
        />
        <UiIcon
          v-else
          block
          name="icon:locker"
          :size="20"
        />
      </template>

      <template v-else>
        <AddMediaItemToListsStatusSelector
          :current-status="props.currentStatus"
          @on-status-change="emits('onStatusChange', $event)"
        />
      </template>
    </template>
  </UiFormListItem>
</template>

<style module lang="scss">
.wrapper {
  height: 40px;
}
</style>
