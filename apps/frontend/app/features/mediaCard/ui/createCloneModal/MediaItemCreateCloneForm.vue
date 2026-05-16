<script setup lang="ts">
import type { MediaItemStatusNameEnum, MediaItemType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { SortOrderEnum } from "@movie-tracker/types"
import { computed, ref, watch } from "vue"
import { toast } from "vue3-toastify"
import { useBulkCreateMediaItemCloneApi, useGetMediaItemsByMediaIdApi } from "~/api/mediaItems/useMediaItemsApi"
import { useGetMediaListsApi } from "~/api/mediaLists/useMediaListsApi"
import MediaItemCreateCloneFormItem from "~/features/mediaCard/ui/createCloneModal/MediaItemCreateCloneFormItem.vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiFormListItemSkeleton } from "~/shared/ui/UiFormListItem"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiInput } from "~/shared/ui/UiInput"
import { UiSwitch } from "~/shared/ui/UiSwitch"
import { UiTypography } from "~/shared/ui/UiTypography"
import { getSortedArrayByDate } from "~/shared/utils/getSortedArrayByDate"

interface MediaItemCreateCloneFormProps {
  mediaItem: MediaItemType
}

const props = defineProps<MediaItemCreateCloneFormProps>()
const model = defineModel<boolean>()
const getMediaListsApi = useGetMediaListsApi({
  refetchOnMount: true,
  staleTime: 0,
})
const getMediaItemsByMediaId = useGetMediaItemsByMediaIdApi({
  mediaId: props.mediaItem.mediaId,
}, {
  staleTime: 0,
  refetchOnMount: true,
})
const { t } = useI18n()
const searchTerm = ref("")
const selectedAddings = ref<Record<string, MediaItemStatusNameEnum>>({})
const isSaveCreationDate = ref(false)
const bulkCreateMediaItemCloneApi = useBulkCreateMediaItemCloneApi()

const allAvailableMediaLists = computed(() => {
  if (!getMediaListsApi.data.value) {
    return []
  }

  return getMediaListsApi.data.value.filter((item) => {
    return !getMediaItemsByMediaId.data.value?.some((el) => {
      return el.mediaType === props.mediaItem.mediaType && el.mediaId === props.mediaItem.mediaId && el.mediaListId === item.id
    })
  })
})

watch(() => allAvailableMediaLists.value, () => {
  const availableListIds = new Set(allAvailableMediaLists.value.map(mediaList => mediaList.id))
  selectedAddings.value = Object.fromEntries(Object.entries(selectedAddings.value).filter(([listId]) => {
    return availableListIds.has(listId)
  }))
})

function onFormSubmit() {
  const selectedMediaLists = Object.entries(selectedAddings.value)

  bulkCreateMediaItemCloneApi.mutateAsync({
    items: selectedMediaLists.map(([listId, status]) => ({
      mediaListId: listId,
      currentStatus: status,
      isSaveCreationDate: isSaveCreationDate.value,
      mediaItemId: props.mediaItem.id,
    })),
  }).then(() => {
    toast.success(t("toasts.mediaItem.successCloneCreated"))
    model.value = false
  }).catch(() => {
    toast.error(t("toasts.mediaItem.unsuccessfullyCloneCreated"))
  })
}

const availableMediaLists = computed(() => {
  if (!allAvailableMediaLists.value.length)
    return []

  return allAvailableMediaLists.value.filter((item) => {
    return searchTerm.value
      ? (item.title || t("mediaList.favorites")).toLowerCase().includes(searchTerm.value.toLowerCase())
      : true
  }) || []
})

const sortedMediaLists = computed(() => {
  return getSortedArrayByDate(availableMediaLists.value, SortOrderEnum.DESC, "createdAt")
})

function handleCheckboxChange(mediaListId: string, isChecked: boolean) {
  if (isChecked) {
    selectedAddings.value[mediaListId] = props.mediaItem.trackingData.currentStatus
    return
  }

  delete selectedAddings.value[mediaListId]
}

function handleStatusChange(mediaListId: string, status: MediaItemStatusNameEnum) {
  if (!selectedAddings.value[mediaListId]) {
    return
  }

  selectedAddings.value[mediaListId] = status
}

const isHasSelectedMediaLists = computed(() => {
  return Object.keys(selectedAddings.value).length > 0
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
    <div :class="$style.list">
      <template v-if="getMediaItemsByMediaId.isFetching.value || getMediaListsApi.isFetching.value">
        <UiFormListItemSkeleton
          v-for="i in 5"
          :key="i"
        />
      </template>
      <template v-else-if="sortedMediaLists.length">
        <MediaItemCreateCloneFormItem
          v-for="mediaList in sortedMediaLists"
          :key="mediaList.id"
          :model-value="Boolean(selectedAddings[mediaList.id])"
          :current-status="selectedAddings[mediaList.id] || props.mediaItem.trackingData.currentStatus"
          :disabled="bulkCreateMediaItemCloneApi.isPending.value"
          :value="mediaList.id"
          :media-list="mediaList"
          @update:model-value="handleCheckboxChange(mediaList.id, $event)"
          @update:current-status="handleStatusChange(mediaList.id, $event)"
        />
      </template>
      <UiTypography
        v-else
        :class="$style.nothingFound"
        variant="description"
      >
        {{ searchTerm.length ? $t("ui.errors.nothingFound") : $t("mediaItem.createClone.noAvailableLists") }}
      </UiTypography>
    </div>

    <div :class="$style.switch">
      <UiTypography variant="description">
        {{ $t('mediaItem.createClone.isSaveCreationDate') }}
      </UiTypography>
      <UiSwitch v-model="isSaveCreationDate" />
    </div>

    <div :class="$style.actions">
      <UiButton
        size="small"
        :disabled="bulkCreateMediaItemCloneApi.isPending.value || !isHasSelectedMediaLists"
        @click="onFormSubmit"
      >
        {{ $t('mediaItem.createClone.clone') }}
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

  .nothingFound {
    text-align: center;
  }

  .switch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .actions {
    margin-top: 8px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
