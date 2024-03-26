<script lang="ts" setup>
import { useGetMediaItemsApi, useUpdateMediaItemApi } from "~/api/mediaItem/useMediaItemtApi";
import type { MediaItemType } from "@movie-tracker/types";
import UiFormActions from "~/components/ui/UiFormActions.vue";
import { computed, ref } from "vue";
import { getCurrentMediaDetails } from "~/utils/getCurrentMediaDetails";
import { useGetMediaListsApi } from "~/api/mediaList/useMediaListApi";
import { useI18n } from "#imports";
import MediaItemModalFormItem from "~/features/mediaItem/ui/MediaItemModalFormItem.vue";
import UiTypography from "~/components/ui/UiTypography.vue";
import UiDivider from "~/components/ui/UiDivider.vue";
import { MediaListCreateModal } from "~/features/mediaList";
import { toast } from "vue3-toastify";

interface MediaItemChangeMediaListFormProps {
  mediaItem: MediaItemType;
  closeModal: () => void;
}

const props = defineProps<MediaItemChangeMediaListFormProps>();
const updateMediaItemApi = useUpdateMediaItemApi();
const getMediaListsApi = useGetMediaListsApi();
const getMediaItemsApi = useGetMediaItemsApi();
const { locale, t } = useI18n();

const selectedListId = ref("");

const isUpdatingPending = computed(() => {
  return updateMediaItemApi.status.value === "pending";
});

const mediaTitle = computed(() => {
  return getCurrentMediaDetails(props.mediaItem.mediaDetails, locale.value)?.title  ?? t("mediaList.favorites");
});

const alreadyInList = computed(() => {
  return getMediaItemsApi.data.value?.filter(item => {
    return item.mediaId === props.mediaItem.mediaId && item.mediaType === props.mediaItem.mediaType;
  });
});

const availableLists = computed(() => {
  return getMediaListsApi.data.value?.filter(list => {
    return !alreadyInList.value?.some(item => item.mediaListId === list.id);
  });
});

const handleChange = async () => {
  await updateMediaItemApi.mutateAsync({
    mediaItemId: props.mediaItem.id,
    body: {
      mediaListId: selectedListId.value
    }
  });
  toast.success(t("mediaItem.changeMediaList.successfullyChanged"));
};
</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography :class="$style.title">
      {{ $t("mediaItem.changeMediaList.description", { title: mediaTitle }) }}
    </UiTypography>

    <UiDivider />

    <template v-if="!!availableLists?.length">
      <MediaItemModalFormItem
        v-for="list in availableLists"
        :key="list.id"
        v-model="selectedListId"
        as-radio-input
        :disabled="isUpdatingPending"
        :list="list"
      />
    </template>

    <UiTypography
      v-else
      :class="$style.noLists"
    >
      {{ $t("mediaItem.changeMediaList.noAvailableLists") }}
      <MediaListCreateModal
        :button-text="`${$t('mediaList.createNew')}?`"
        :class="$style.createListButton"
        button-variant="clear"
      />
    </UiTypography>

    <UiFormActions
      :confirm-text="$t('mediaItem.changeMediaList.change')"
      :is-cancel-disabled="isUpdatingPending"
      :is-confirm-disabled="isUpdatingPending || !selectedListId"
      @cancel="closeModal"
      @confirm="() => {
        handleChange().then(() => {
          props.closeModal()
        })
      }"
    />
  </div>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .title {
    text-align: center;
    color: var(--c-secondary);
    font-weight: var(--fw-bold);
  }
}

.createListButton {
  padding: 0;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
