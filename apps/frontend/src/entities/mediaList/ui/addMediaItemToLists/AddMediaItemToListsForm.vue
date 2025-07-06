<script setup lang="ts">
import type { MediaTypeEnum, TmdbMediaTypeEnum } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { MediaItemStatusNameEnum, SortOrderEnum } from "@movie-tracker/types"
import { computed, ref, watch } from "vue"
import { toast } from "vue3-toastify"
import {
  useCreateMediaItemApi,
  useDeleteMediaItemApi,
  useGetMediaItemsApi,
  useUpdateMediaItemTrackingDataApi,
} from "~/api/mediaItem/useMediaItemtApi"
import { useGetMediaListsApi } from "~/api/mediaList/useMediaListApi"
import AddMediaItemToListsFormItem from "~/entities/mediaList/ui/addMediaItemToLists/AddMediaItemToListsFormItem.vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiInput } from "~/shared/ui/UiInput"
import { UiTypography } from "~/shared/ui/UiTypography"
import { getSortedArrayByDate } from "~/shared/utils/getSortedArrayByDate"

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

const props = defineProps<MediaListSelectorModalProps>()

const emit = defineEmits<{
  (e: "onAfterSave"): void
}>()

const { t } = useI18n()

const getMediaListsApi = useGetMediaListsApi()
const getMediaItemsApi = useGetMediaItemsApi()
const createMediaItemApi = useCreateMediaItemApi()
const deleteMediaItemApi = useDeleteMediaItemApi()
const updateMediaItemTrackingDataApi = useUpdateMediaItemTrackingDataApi()

const searchTerm = ref("")
const changes = ref<Record<string, MediaListChangeType>>({})

function setCurrentListStates() {
  for (const mediaList of getMediaListsApi.data.value || []) {
    const mediaItem = getMediaItemsApi.data.value?.find(
      item => item.mediaListId === mediaList.id
        && item.mediaId === props.mediaId
        && item.mediaType === props.mediaType,
    )

    changes.value[mediaList.id] = {
      checked: Boolean(mediaItem),
      mediaListId: mediaList.id,
      mediaItemId: mediaItem?.id,
      action: "pass",
      currentStatus: mediaItem?.trackingData.currentStatus || MediaItemStatusNameEnum.NOT_VIEWED,
    }
  }
}

watch(() => getMediaItemsApi.data, () => {
  setCurrentListStates()
}, { immediate: true })

const isLoading = computed(() => createMediaItemApi.isPending.value || deleteMediaItemApi.isPending.value || updateMediaItemTrackingDataApi.isPending.value)

function handleCheckboxChange(mediaListId: string, isChecked: boolean) {
  const currentState = changes.value[mediaListId]
  if (!currentState) {
    return
  }

  let action: Exclude<MediaListChangeType["action"], "update"> = "pass"
  // * Item is already in the list
  if (!isChecked && currentState.mediaItemId) {
    action = "remove"
  }
  // * Item wasn't in the list
  else if (isChecked && !currentState.mediaItemId) {
    action = "add"
  }

  changes.value[mediaListId].checked = isChecked
  changes.value[mediaListId].action = action
}

function handleStatusChange(mediaListId: string, status: MediaItemStatusNameEnum) {
  const currentState = changes.value[mediaListId]
  if (!currentState) {
    return
  }

  changes.value[mediaListId].currentStatus = status

  if (currentState.mediaItemId) {
    const mediaItem = getMediaItemsApi.data.value?.find(item => item.id === currentState.mediaItemId)
    const isSameStatus = mediaItem?.trackingData.currentStatus === status
    changes.value[mediaListId].action = isSameStatus ? "pass" : "update"
  }
}

function handleSaveChanges() {
  Promise.all(Object.entries(changes.value).map(([mediaListId, value]) => {
    switch (value.action) {
      case "add":
        return createMediaItemApi.mutateAsync({
          mediaId: props.mediaId,
          mediaType: props.mediaType as MediaTypeEnum,
          mediaListId,
          currentStatus: value.currentStatus,
        })
      case "remove":
        if (value.mediaItemId) {
          return deleteMediaItemApi.mutateAsync(value.mediaItemId)
        }
        break
      case "update": {
        const mediaItem = getMediaItemsApi.data.value?.find(item => item.id === value.mediaItemId)
        if (mediaItem) {
          return updateMediaItemTrackingDataApi.mutateAsync({
            trackingDataId: mediaItem.trackingData.id,
            body: {
              ...mediaItem.trackingData,
              currentStatus: value.currentStatus,
            },
          })
        }
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
  return Object.values(changes.value).some((el) => {
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
      :class="$style.list"
    >
      <template v-if="sortedMediaLists.length">
        <AddMediaItemToListsFormItem
          v-for="mediaList in sortedMediaLists"
          :key="mediaList.id"
          v-model="changes[mediaList.id].checked"
          :current-status="changes[mediaList.id]!.currentStatus"
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
@import "~/shared/styles/breakpoints";

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
