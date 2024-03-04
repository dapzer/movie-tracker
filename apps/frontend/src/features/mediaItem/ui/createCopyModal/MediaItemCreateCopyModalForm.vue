<script lang="ts" setup>

import UiTypography from "~/components/ui/UiTypography.vue";
import UiSwitch from "~/components/ui/UiSwitch.vue";
import { MediaListCreateModal } from "~/features/mediaList";
import { type MediaDetailsType, MediaTypeEnum } from "@movie-tracker/types";
import {
  getCurrentMediaDetails,
  useCreateMediaItemCopyApi,
  useGetMediaItemsApi,
  useGetMediaListsApi,
  useI18n
} from "#imports";
import { computed, ref } from "vue";
import { toast } from "vue3-toastify";
import UiDivider from "~/components/ui/UiDivider.vue";
import UiFormActions from "~/components/ui/UiFormActions.vue";
import MediaItemModalFormItem from "~/features/mediaItem/ui/MediaItemModalFormItem.vue";

interface MediaItemCreateCopyModalFormProps {
  mediaId: number;
  mediaType: MediaTypeEnum;
  mediaItemId: string;
  mediaDetails?: MediaDetailsType;
  closeModal: () => void;
}

const props = defineProps<MediaItemCreateCopyModalFormProps>();
const { locale, t } = useI18n();

const getMediaListsApi = useGetMediaListsApi();
const getMediaItemsApi = useGetMediaItemsApi();
const createMediaItemCopyApi = useCreateMediaItemCopyApi();

const selectedLists = ref<string[]>([]);
const isSaveCreationDate = ref(false);

const isCreatingPending = computed(() => {
  return createMediaItemCopyApi.status.value === "pending";
});

const mediaTitle = computed(() => {
  return getCurrentMediaDetails(props.mediaDetails, locale.value)?.title ?? t("mediaList.favorites");
});

const alreadyInList = computed(() => {
  return getMediaItemsApi.data.value?.filter(item => {
    return item.mediaId === props.mediaId && item.mediaType === props.mediaType;
  });
});

const availableLists = computed(() => {
  return getMediaListsApi.data.value?.filter(list => {
    return !alreadyInList.value?.some(item => item.mediaListId === list.id);
  });
});

const handleCreateCopy = async () => {
  for (const listId of selectedLists.value) {
    await createMediaItemCopyApi.mutateAsync({
      mediaListId: listId,
      isSaveCreationDate: isSaveCreationDate.value,
      mediaItemId: props.mediaItemId
    });
  }
  toast.success(t("mediaItem.createCopy.successfullyCreated"));
};

</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography :class="$style.title">
      {{ $t("mediaItem.createCopy.description", { title: mediaTitle }) }}
    </UiTypography>
    <UiDivider />
    <div
      v-if="!!availableLists?.length"
      :class="$style.list"
    >
      <MediaItemModalFormItem
        v-for="list in availableLists"
        :key="list.id"
        v-model="selectedLists"
        :disabled="isCreatingPending"
        :list="list"
      />

      <div :class="$style.listItem">
        <UiTypography>
          {{ $t("mediaItem.createCopy.isSaveCreationDate") }}
        </UiTypography>
        <UiSwitch
          v-model="isSaveCreationDate"
          :is-disabled="isCreatingPending"
        />
      </div>
    </div>

    <UiTypography
      v-else
      :class="$style.noLists"
    >
      {{ $t("mediaItem.createCopy.noAvailableLists") }}
      <MediaListCreateModal
        :button-text="`${$t('mediaList.createNew')}?`"
        :class="$style.createListButton"
        button-variant="clear"
      />
    </UiTypography>

    <UiFormActions
      :confirm-text="$t('mediaItem.createCopy.clone')"
      :is-cancel-disabled="isCreatingPending"
      :is-confirm-disabled="isCreatingPending || selectedLists.length === 0"
      @cancel="closeModal"
      @confirm="() => {
        handleCreateCopy().then(() => {
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

  .listItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;
  }
}
</style>
