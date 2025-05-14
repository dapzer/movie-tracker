<script setup lang="ts">
import type { MediaItemType, MediaListType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { useQueryClient } from "@tanstack/vue-query"
import { computed, ref } from "vue"
import { toast } from "vue3-toastify"
import { useGetMediaItemsApi, useUpdateMediaItemApi } from "~/api/mediaItem/useMediaItemtApi"
import { MediaListQueryKeys } from "~/api/mediaList/mediaListApiQueryKeys"
import { useGetMediaListsApi } from "~/api/mediaList/useMediaListApi"
import MediaItemChangeMediaListFormItem
  from "~/features/mediaCard/ui/changeMediaListModal/MediaItemChangeMediaListFormItem.vue"
import { useForm } from "~/shared/composables/useForm"
import { SortOrderEnum } from "~/shared/types/Sorting"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiInput } from "~/shared/ui/UiInput"
import { UiTypography } from "~/shared/ui/UiTypography"
import { getSortedArrayByDate } from "~/shared/utils/getSortedArrayByDate"

interface MediaItemChangeMediaListFormProps {
  mediaItem: MediaItemType
}

const props = defineProps<MediaItemChangeMediaListFormProps>()
const model = defineModel<boolean>()
const getMediaListsApi = useGetMediaListsApi()
const getMediaItemsApi = useGetMediaItemsApi()
const { t } = useI18n()
const searchTerm = ref("")
const updateMediaItemApi = useUpdateMediaItemApi()
const queryClient = useQueryClient()

const { formValue, onFormSubmit } = useForm({
  initialValue: {
    selectedMediaListId: "",
  },
  onSubmit: (formValue) => {
    updateMediaItemApi.mutateAsync({
      mediaItemId: props.mediaItem.id,
      body: {
        mediaListId: formValue.selectedMediaListId,
      },
    }).then(async () => {
      await queryClient.setQueryData([MediaListQueryKeys.GET_ALL], (oldData: MediaListType[]) => {
        return oldData.map((el) => {
          if (el.id === formValue.selectedMediaListId) {
            el.mediaItemsCount = (el.mediaItemsCount || 0) + 1
          }
          else if (props.mediaItem.mediaListId === el.id) {
            el.mediaItemsCount = (el.mediaItemsCount || 1) - 1
          }

          return el
        })
      })
      toast.success(t("toasts.mediaItem.successListChanged"))
      model.value = false
    }).catch(() => {
      toast.error(t("toasts.mediaItem.unsuccessfullyListChanged"))
    })
  },
})

const availableMediaLists = computed(() => {
  if (!getMediaListsApi.data.value)
    return []

  return getMediaListsApi.data.value.filter((item) => {
    if (getMediaItemsApi.data.value?.some((el) => {
      return el.mediaType === props.mediaItem.mediaType && el.mediaId === props.mediaItem.mediaId && el.mediaListId === item.id
    })) {
      return false
    }

    return searchTerm.value
      ? (item.title || t("mediaList.favorites")).toLowerCase().includes(searchTerm.value.toLowerCase())
      : true
  }) || []
})

const sortedMediaLists = computed(() => {
  return getSortedArrayByDate(availableMediaLists.value, SortOrderEnum.DESC, "createdAt")
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
      <template v-if="sortedMediaLists.length">
        <MediaItemChangeMediaListFormItem
          v-for="mediaList in sortedMediaLists"
          :key="mediaList.id"
          v-model="formValue.selectedMediaListId"
          radio
          :disabled="updateMediaItemApi.isPending.value"
          :value="mediaList.id"
          :media-list="mediaList"
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

    <div :class="$style.actions">
      <UiButton
        size="small"
        :disabled="updateMediaItemApi.isPending.value || !formValue.selectedMediaListId"
        @click="onFormSubmit"
      >
        {{ $t('mediaItem.changeMediaList.button') }}
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

  .actions {
    margin-top: 8px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
