<script setup lang="ts">

import type { MediaItemType } from "@movie-tracker/types"
import { UiInput } from "~/components/newUi/UiInput"
import { SearchIcon } from "~/components/ui/icons"
import { computed, ref } from "vue"
import { useGetMediaListsApi } from "~/api/mediaList/useMediaListApi"
import { useForm, useI18n } from "#imports"
import { UiTypography } from "~/components/newUi/UiTypography"
import { UiButton } from "~/components/newUi/UiButton"
import { toast } from "vue3-toastify"
import { useGetMediaItemsApi, useUpdateMediaItemApi } from "~/api/mediaItem/useMediaItemtApi"
import MediaItemChangeMediaListFormItem
  from "~/features/mediaCard/ui/changeMediaListModal/MediaItemChangeMediaListFormItem.vue"

interface MediaItemChangeMediaListFormProps {
  mediaItem: MediaItemType;
}

const props = defineProps<MediaItemChangeMediaListFormProps>();
const model = defineModel<boolean>();
const getMediaListsApi = useGetMediaListsApi();
const getMediaItemsApi = useGetMediaItemsApi();
const { t } = useI18n();
const searchTerm = ref("");
const updateMediaItemApi = useUpdateMediaItemApi();

const { formValue, onFormSubmit } = useForm({
  initialValue: {
    selectedMediaListId: "",
  },
  onSubmit: (formValue) => {
    updateMediaItemApi.mutateAsync({
      mediaItemId: props.mediaItem.id,
      body: {
        mediaListId: formValue.selectedMediaListId
      }
    }).then(() => {
      toast.success(t("toasts.mediaItem.successListChanged"));
      model.value = false
    }).catch(() => {
      toast.error(t("toasts.mediaItem.unsuccessfullyListChanged"));
    });
  }
})

const availableMediaLists = computed(() => {
  if (!getMediaListsApi.data.value) return [];

  return getMediaListsApi.data.value.filter(item => {
    if (getMediaItemsApi.data.value?.some(el => {
      return el.mediaType === props.mediaItem.mediaType && el.mediaId === props.mediaItem.mediaId && el.mediaListId === item.id
    })) return false

    return searchTerm.value
        ? (item.title || t('mediaList.favorites')).toLowerCase().includes(searchTerm.value.toLowerCase())
        : true;
  }) || [];
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
          <SearchIcon />
        </template>
      </UiInput>
      <slot name="action" />
    </div>
    <div :class="$style.list">
      <template v-if="availableMediaLists.length">
        <MediaItemChangeMediaListFormItem
          v-for="mediaList in availableMediaLists"
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
@import "~/styles/mixins";
@import "~/styles/newVariables";

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
