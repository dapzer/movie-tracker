<script lang="ts" setup>

import { CheckMarkIcon, SettingsIcon, ShareIcon, TrashIcon } from "~/components/ui/icons";
import UiButton from "~/components/ui/UiButton.vue";
import type { MediaListType } from "@movie-tracker/types";
import { useClipboard } from "@vueuse/core";
import { UiConfirmationModal, UiModal } from "~/components/ui/UiModal";
import MediaListForm from "~/features/mediaList/ui/MediaListForm.vue";
import { useDeleteMediaListApi, useUpdateMediaListApi } from "~/api/mediaList/useMediaListApi";
import { computed, ref } from "vue";
import type { MediaListUpdateApiTypes } from "~/api/mediaList/mediaListApiTypes";
import { toast } from "vue3-toastify";
import { useI18n } from "#imports";

const { copy, copied } = useClipboard({ copiedDuring: 1000 });

interface MediaListCardControlsProps {
  list: MediaListType;
}

const props = defineProps<MediaListCardControlsProps>();
const { t } = useI18n()

const updateMediaListApi = useUpdateMediaListApi();
const deleteMediaListApi = useDeleteMediaListApi();

const isUpdatingMediaList = computed(() => updateMediaListApi.status.value === "pending");
const settingsModalRef = ref<InstanceType<typeof UiModal> | null>(null);

const copyLink = () => {
  copy(`${window.location.origin}/lists/${props.list.humanFriendlyId}`);
};

const handleUpdateList = async (value: MediaListUpdateApiTypes) => {
  await updateMediaListApi.mutateAsync({ mediaListId: props.list.id, body: value }).then(() => {
    toast.success(t('toasts.mediaList.successUpdated'));
  })
  settingsModalRef.value?.handleVisible(false);
};

const handleDeleteList = async () => {
  await deleteMediaListApi.mutateAsync(props.list.id).then(() => {
    toast.success(t('toasts.mediaList.successDeleted'));
  })
}
</script>

<template>
  <div :class="$style.wrapper">
    <UiButton
      :class="$style.copyLink"
      :color-scheme="copied ? 'afterSuccess' : undefined"
      :disabled="!props.list.isPublic"
      @click="copyLink"
    >
      <CheckMarkIcon v-if="copied" />
      <ShareIcon v-else />
    </UiButton>

    <UiModal
      ref="settingsModalRef"
      :max-width="470"
      :title="$t('ui.settings')"
    >
      <template #trigger>
        <SettingsIcon />
      </template>

      <template #content="{ closeModal }">
        <MediaListForm
          :initial-value="{
            title: props.list.title,
            isPublic: props.list.isPublic,
            poster: props.list.poster
          }"
          :is-loading="isUpdatingMediaList"
          :is-system="props.list.isSystem"
          @on-click-save="handleUpdateList"
          @on-click-cancel="closeModal"
        />
      </template>
    </UiModal>

    <UiConfirmationModal
      :class="$style.removeBtn"
      :description="$t('mediaList.confirmDeleteDescription')"
      :disabled="props.list.isSystem"
      :title="$t('mediaList.confirmDeleteTitle', { title: props.list.title})"
      button-color-scheme="danger"
      @on-confirm="handleDeleteList"
    >
      <TrashIcon />
    </UiConfirmationModal>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  gap: 12px;

  .removeBtn {
    margin-left: auto;
  }

  button {
    border-radius: var(--s-border-radius);
    padding: 4px 8px;
  }

  .copyLink {
      svg {
        width: 24px;
        height: 24px;
      }
  }
}
</style>
