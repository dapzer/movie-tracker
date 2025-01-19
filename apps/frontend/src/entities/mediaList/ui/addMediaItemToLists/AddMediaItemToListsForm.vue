<script setup lang="ts">
import { useGetMediaListsApi } from "~/api/mediaList/useMediaListApi"
import { useCreateMediaItemApi, useDeleteMediaItemApi, useGetMediaItemsApi } from "~/api/mediaItem/useMediaItemtApi"
import { computed, ref, watch } from "vue"
import { UiInput } from "~/components/ui/UiInput"
import AddMediaItemToListsFormItem from "~/entities/mediaList/ui/addMediaItemToLists/AddMediaItemToListsFormItem.vue"
import { MediaTypeEnum, TmdbMediaTypeEnum } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { UiButton } from "~/components/ui/UiButton"
import { toast } from "vue3-toastify"
import { UiTypography } from "~/components/ui/UiTypography"
import { UiIcon } from "~/components/ui/UiIcon"

const getMediaListsApi = useGetMediaListsApi();
const getMediaItemsApi = useGetMediaItemsApi();

export interface MediaListChangeType {
  mediaListId: string
  mediaItemId?: string
  action: "add" | "remove"
}

interface MediaListSelectorModalProps {
  mediaId: number;
  mediaType: TmdbMediaTypeEnum | MediaTypeEnum;
}

const props = defineProps<MediaListSelectorModalProps>();
const emit = defineEmits<{
  (e: 'onAfterSave'): void
}>()
const { t } = useI18n();

const createMediaItemApi = useCreateMediaItemApi();
const deleteMediaItemApi = useDeleteMediaItemApi();

const searchTerm = ref("");
const changes = ref<MediaListChangeType[]>([])
const currentListStates = ref<Record<string, boolean>>()

const setCurrentListStates = () => {
  currentListStates.value = Object.fromEntries(
      getMediaListsApi.data.value?.map(item => {
        const mediaItem = getMediaItemsApi.data.value?.find(
            mediaItem => mediaItem.mediaListId === item.id &&
                mediaItem.mediaId === props.mediaId &&
                mediaItem.mediaType === props.mediaType
        )
        return [item.id, !!mediaItem]
      }) || []
  )
}

watch(() => getMediaItemsApi.data, () => {
  setCurrentListStates()
}, { immediate: true })

const isLoading = computed(() => createMediaItemApi.isPending.value || deleteMediaItemApi.isPending.value)

const handleCheckboxChange = (mediaListId: string, isChecked: boolean) => {
  const mediaItem = getMediaItemsApi.data.value?.find(
      item => item.mediaListId === mediaListId &&
          item.mediaId === props.mediaId &&
          item.mediaType === props.mediaType
  )

  if (isChecked !== !!mediaItem) {
    changes.value.push({
      mediaListId,
      mediaItemId: mediaItem?.id,
      action: isChecked ? 'add' : 'remove'
    })
  } else {
    const index = changes.value.findIndex((el, index) => {
      return el.mediaListId !== mediaListId
    })
    changes.value.splice(index, 1)
  }
}

const handleSaveChanges = () => {
  Promise.all(changes.value.map(el => {
    if (el.action === "add") {
      return createMediaItemApi.mutateAsync({
        mediaId: props.mediaId,
        mediaType: props.mediaType as MediaTypeEnum,
        mediaListId: el.mediaListId
      })
    }

    if (el.action === "remove" && el.mediaItemId) {
      return deleteMediaItemApi.mutateAsync(el.mediaItemId)
    }
  })).then(() => {
    toast.success(t("toasts.changesSuccessfullySaved"))
    emit('onAfterSave')
  }).catch(() => {
    setCurrentListStates()
    toast.error(t("toasts.changesUnsuccessfullySaved"))
  }).finally(() => {
    changes.value = [];
  })
}

const filteredMediaLists = computed(() => {
  if (!getMediaListsApi.data?.value) {
    return []
  }

  if (!searchTerm.value) {
    return getMediaListsApi.data.value;
  }

  return getMediaListsApi.data.value.filter((list) =>
      (list.title || t('mediaList.favorites')).toLowerCase().includes(searchTerm.value.toLowerCase())
  )
});
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
      v-if="currentListStates"
      :class="$style.list"
    >
      <template v-if="filteredMediaLists.length">
        <AddMediaItemToListsFormItem
          v-for="mediaList in filteredMediaLists"
          :key="mediaList.id"
          v-model="currentListStates[mediaList.id]"
          :disabled="isLoading"
          :media-list="mediaList"
          @change="(e: Event) => handleCheckboxChange(mediaList.id, (e.target as HTMLInputElement).checked)"
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
        :disabled="!changes.length || isLoading"
        @click="handleSaveChanges"
      >
        {{ $t("ui.actions.save") }}
      </UiButton>
    </div>
  </div>
</template>

<style module lang="scss">
@import "~/styles/mixins";
@import "~/styles/variables";

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
