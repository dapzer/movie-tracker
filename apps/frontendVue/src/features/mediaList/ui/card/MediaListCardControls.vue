<script lang="ts" setup>

import { CheckMarkIcon, SettingsIcon, ShareIcon, TrashIcon } from "~/components/ui/icons";
import UiButton from "~/components/ui/UiButton.vue";
import type { MediaListType } from "@movie-tracker/types";
import { useClipboard } from "@vueuse/core";
import { UiConfirmationModal, UiModal } from "~/components/ui/UiModal";
import MediaListForm from "~/features/mediaList/ui/MediaListForm.vue";
import { useDeleteMediaListApi, useUpdateMediaListApi } from "~/composables/useMediaListApi";
import { computed, ref, type VNode } from "vue";
import type { MediaListUpdateApiTypes } from "~/types/mediaListApiTypes";

const { copy, copied } = useClipboard({ copiedDuring: 1000 });

interface MediaListCardControlsProps {
  list: MediaListType;
}

const props = defineProps<MediaListCardControlsProps>();
const { mutateAsync: updateList, status: updateListStatus } = useUpdateMediaListApi();
const { mutateAsync: deleteList, status: deleteListStatus } = useDeleteMediaListApi();

const isUpdatingMediaList = computed(() => updateListStatus.value === "pending");
const settingsModalRef = ref<InstanceType<typeof UiModal> | null>(null);

const copyLink = () => {
  copy(`${window.location.origin}/lists/${props.list.id}`);
};

const handleUpdateList = async (value: MediaListUpdateApiTypes) => {
  await updateList({ mediaListId: props.list.id, body: value });
  settingsModalRef.value?.handleVisible(false);
}
</script>

<template>
  <div :class="$style.wrapper">
    <UiButton
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
          @on-click-save="handleUpdateList"
          @on-click-cancel="closeModal"
        />
      </template>
    </UiModal>

    <UiConfirmationModal
      :class="$style.removeBtn"
      :description="$t('mediaList.confirmDeleteDescription')"
      :disabled="props.list.isSystem"
      :title="$t('mediaList.confirmDeleteTitle', { title: props.list.title || $t('mediaList.nameNotSet') })"
      button-color-scheme="danger"
      @on-confirm="deleteList(props.list.id)"
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
}
</style>
