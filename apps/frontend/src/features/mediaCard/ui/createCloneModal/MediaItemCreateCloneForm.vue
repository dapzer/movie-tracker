<script setup lang="ts">
import type { MediaItemType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed, ref } from "vue"
import { toast } from "vue3-toastify"
import { useCreateMediaItemCloneApi, useGetMediaItemsApi } from "~/api/mediaItem/useMediaItemtApi"
import { useGetMediaListsApi } from "~/api/mediaList/useMediaListApi"
import MediaItemCreateCloneFormItem from "~/features/mediaCard/ui/createCloneModal/MediaItemCreateCloneFormItem.vue"
import { useForm } from "~/shared/composables/useForm"
import { SortOrderEnum } from "~/shared/types/Sorting"
import { UiButton } from "~/shared/ui/UiButton"
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
const getMediaListsApi = useGetMediaListsApi()
const getMediaItemsApi = useGetMediaItemsApi()
const { t } = useI18n()
const searchTerm = ref("")
const createMediaItemCloneApi = useCreateMediaItemCloneApi()

const { formValue, onFormSubmit } = useForm({
  initialValue: {
    selectedMediaListIds: [],
    isSaveCreationDate: false,
  },
  onSubmit: (formValue) => {
    Promise.all(formValue.selectedMediaListIds.map((listId) => {
      return createMediaItemCloneApi.mutateAsync({
        mediaListId: listId,
        isSaveCreationDate: formValue.isSaveCreationDate,
        mediaItemId: props.mediaItem.id,
      })
    })).then(() => {
      toast.success(t("toasts.mediaItem.successCloneCreated"))
      model.value = false
    }).catch(() => {
      toast.error(t("toasts.mediaItem.unsuccessfullyCloneCreated"))
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
        <MediaItemCreateCloneFormItem
          v-for="mediaList in sortedMediaLists"
          :key="mediaList.id"
          v-model="formValue.selectedMediaListIds"
          :disabled="createMediaItemCloneApi.isPending.value"
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

    <div :class="$style.switch">
      <UiTypography variant="description">
        {{ $t('mediaItem.createClone.isSaveCreationDate') }}
      </UiTypography>
      <UiSwitch v-model="formValue.isSaveCreationDate" />
    </div>

    <div :class="$style.actions">
      <UiButton
        size="small"
        :disabled="createMediaItemCloneApi.isPending.value || !formValue.selectedMediaListIds.length"
        @click="onFormSubmit"
      >
        {{ $t('mediaItem.createClone.clone') }}
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
