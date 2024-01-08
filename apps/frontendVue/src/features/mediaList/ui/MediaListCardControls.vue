<script lang="ts" setup>

import { CheckMarkIcon, SettingsIcon, ShareIcon, TrashIcon } from "~/components/ui/icons";
import UiButton from "~/components/ui/UiButton.vue";
import type { MediaListType } from "@movie-tracker/types";
import { useClipboard } from "@vueuse/core";
import { UiModal } from "~/components/ui/UiModal";
import MediaListCardSettings from "~/features/mediaList/ui/MediaListForm.vue";
import { useDeleteMediaListApi, useUpdateMediaListApi } from "~/composables/useMediaListApi";
import { computed } from "vue";

const { copy, copied } = useClipboard({ copiedDuring: 1000 });

interface MediaListCardControlsProps {
  list: MediaListType;
}

const props = defineProps<MediaListCardControlsProps>();
const { mutateAsync: updateList, status: updateListStatus } = useUpdateMediaListApi();
const { mutateAsync: deleteList, status: deleteListStatus } = useDeleteMediaListApi();

const isUpdatingMediaList = computed(() => updateListStatus.value === "pending");

const copyLink = () => {
  copy(`${window.location.origin}/lists/${props.list.id}`);
};
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
      :max-width="470"
      :title="$t('ui.settings')"
    >
      <template #trigger>
        <SettingsIcon />
      </template>

      <template #content="{ closeModal }">
        <MediaListCardSettings
          :initial-value="{
            title: props.list.title,
            isPublic: props.list.isPublic,
            poster: props.list.poster
          }"
          :is-loading="isUpdatingMediaList"
          @on-click-save="(value) => updateList({mediaListId: props.list.id, body: value}).then(() => closeModal())"
          @on-click-cancel="closeModal"
        />
      </template>
    </UiModal>

    <UiButton
      :class="$style.removeBtn"
      :disabled="props.list.isSystem"
      color-scheme="danger"
      @click="deleteList(props.list.id)"
    >
      <TrashIcon />
    </UiButton>
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
