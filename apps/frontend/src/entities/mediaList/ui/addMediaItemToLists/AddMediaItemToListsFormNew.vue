<script setup lang="ts">
import type { MediaTypeEnum, TmdbMediaTypeEnum } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { MediaItemStatusNameEnum } from "@movie-tracker/types"
import { computed, ref, watch } from "vue"
import { toast } from "vue3-toastify"
import { useCreateMediaItemApi, useDeleteMediaItemApi, useGetMediaItemsApi } from "~/api/mediaItem/useMediaItemtApi"
import { useGetMediaListsApi } from "~/api/mediaList/useMediaListApi"
import AddMediaItemToListsFormItem from "~/entities/mediaList/ui/addMediaItemToLists/AddMediaItemToListsFormItem.vue"
import { SortOrderEnum } from "~/shared/types/Sorting"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiInput } from "~/shared/ui/UiInput"
import { UiTypography } from "~/shared/ui/UiTypography"
import { getSortedArrayByDate } from "~/shared/utils/getSortedArrayByDate"

const props = defineProps<MediaListSelectorModalProps>()
const emit = defineEmits<{
  (e: "onAfterSave"): void
}>()
const getMediaListsApi = useGetMediaListsApi()
const getMediaItemsApi = useGetMediaItemsApi()

export interface MediaListChangeType {
  checked: boolean
  mediaListId: string
  mediaItemId?: string
  action: "add" | "remove" | "pass" | "update"
  currentStatus: MediaItemStatusNameEnum
}

interface MediaListSelectorModalProps {
  mediaId: number
  mediaType: TmdbMediaTypeEnum | MediaTypeEnum
}

const { t } = useI18n()

const createMediaItemApi = useCreateMediaItemApi()
const deleteMediaItemApi = useDeleteMediaItemApi()

const searchTerm = ref("")
const changes = ref<Map<string, MediaListChangeType>>(new Map())

function setCurrentListStates() {
  for (const mediaList of getMediaListsApi.data.value || []) {
    const mediaItem = getMediaItemsApi.data.value?.find(
      item => item.mediaListId === mediaList.id
        && item.mediaId === props.mediaId
        && item.mediaType === props.mediaType,
    )

    changes.value.set(mediaList.id, {
      checked: !!mediaItem,
      mediaListId: mediaList.id,
      mediaItemId: mediaItem?.id,
      action: "pass",
      currentStatus: mediaItem?.trackingData.currentStatus || MediaItemStatusNameEnum.NOT_VIEWED,
    })
  }
}

watch(() => getMediaItemsApi.data, () => {
  setCurrentListStates()
}, { immediate: true })

const isLoading = computed(() => createMediaItemApi.isPending.value || deleteMediaItemApi.isPending.value)

function handleCheckboxChange(mediaListId: string, isChecked: boolean) {
  const currentState = changes.value.get(mediaListId)
  if (!currentState) {
    return
  }

  let action: Exclude<MediaListChangeType["action"], "update"> = "pass"

  // * Item is already in the list
  if (currentState?.checked && currentState.mediaItemId) {
    action = "remove"
  }
  // * Item wasn't in the list
  else if (!currentState?.checked) {
    action = "add"
  }

  changes.value.set(mediaListId, {
    ...currentState,
    checked: isChecked,
    action,
  })
}

function handleStatusChange(mediaListId: string, status: MediaItemStatusNameEnum) {
  const currentState = changes.value.get(mediaListId)
  if (!currentState) {
    return
  }

  changes.value.set(mediaListId, {
    ...currentState,
    currentStatus: status,
    action: currentState.mediaItemId ? "update" : currentState.action,
  })
}

function handleSaveChanges() {
  Promise.all(Array.from(changes.value, ([key, value]) => ({ key, value })).map((el) => {
    switch (el.value.action) {
      case "add":
        return createMediaItemApi.mutateAsync({
          mediaId: props.mediaId,
          mediaType: props.mediaType as MediaTypeEnum,
          mediaListId: el.value.mediaListId,
        })
      case "remove":
        if (el.value.mediaItemId) {
          return deleteMediaItemApi.mutateAsync(el.value.mediaItemId)
        }
    }

    return Promise.resolve()
  })).then(() => {
    toast.success(t("toasts.changesSuccessfullySaved"))
    emit("onAfterSave")
  }).catch(() => {
    setCurrentListStates()
    toast.error(t("toasts.changesUnsuccessfullySaved"))
  }).finally(() => {
    setCurrentListStates()
  })
}

const filteredMediaLists = computed(() => {
  if (!getMediaListsApi.data?.value) {
    return []
  }

  if (!searchTerm.value) {
    return getMediaListsApi.data.value
  }

  return getMediaListsApi.data.value.filter(list =>
    (list.title || t("mediaList.favorites")).toLowerCase().includes(searchTerm.value.toLowerCase()),
  )
})

const sortedMediaLists = computed(() => {
  return getSortedArrayByDate(filteredMediaLists.value, SortOrderEnum.DESC, "createdAt")
})

const isHasChanges = computed(() => {
  return changes.value.values().some((el) => {
    return el.action !== "pass"
  })
})
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.header">
      <UiInput
        v-model="searchTerm"
        size="small"
        :placeholder="$t('search.placeholder')"
      >
        <template #icon>
          <UiIcon name="icon:search" />
        </template>
      </UiInput>
      <slot name="action" />
    </div>
    <div
      v-if="changes.size > 0"
      :class="$style.list"
    >
      <template v-if="sortedMediaLists.length">
        <AddMediaItemToListsFormItem
          v-for="mediaList in sortedMediaLists"
          :key="mediaList.id"
          v-model="changes.get(mediaList.id)!.checked"
          v-model:status="changes.get(mediaList.id)!.currentStatus"
          :disabled="isLoading"
          :media-list="mediaList"
          @change="(e: Event) => handleCheckboxChange(mediaList.id, (e.target as HTMLInputElement).checked)"
          @on-status-change="handleStatusChange(mediaList.id, $event)"
        />
      </template>

      <UiTypography
        v-else
        :class="$style.nothingFound"
        variant="description"
      >
        {{ t("ui.errors.nothingFound") }}
      </UiTypography>
    </div>
    <div :class="$style.actions">
      <UiButton
        :disabled="!isHasChanges || isLoading"
        @click="handleSaveChanges"
      >
        {{ $t("ui.actions.save") }}
      </UiButton>
    </div>
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";
@import "~/shared/styles/variables";

.wrapper {
  flex-direction: column;
  display: flex;
  gap: 12px;

  .header {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
  }

  .list {
    min-width: 0;
    overflow-y: auto;
    max-height: calc(40px * 5);
  }

  .actions {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;

    @include mobileDevice {
      justify-content: center;
    }
  }

  .nothingFound {
    text-align: center;
  }
}
</style>
