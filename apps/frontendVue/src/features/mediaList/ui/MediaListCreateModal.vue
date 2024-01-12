<script lang="ts" setup>
import { useCreateMediaListApi, useUpdateMediaListApi } from "#imports";
import { UiModal } from "~/components/ui/UiModal";
import { computed, ref } from "vue";
import MediaListForm from "~/features/mediaList/ui/MediaListForm.vue";
import type { MediaListUpdateApiTypes } from "~/types/mediaListApiTypes";

const { mutateAsync: createList, status: createListStatus } = useCreateMediaListApi();
const { mutateAsync: updateList, status: updateListStatus } = useUpdateMediaListApi();

const isCreatingMediaList = computed(() => createListStatus.value === "pending");
const isUpdatingMediaList = computed(() => updateListStatus.value === "pending");
const createModalRef = ref<InstanceType<typeof UiModal> | null>(null);

const handleCreateMediaList = async (value: MediaListUpdateApiTypes) => {
  await createList(value);
  createModalRef.value?.handleVisible(false);
};
</script>

<template>
  <UiModal
    ref="createModalRef"
    :max-width="470"
    :title="$t('mediaList.create')"
    button-size="small"
  >
    <template #trigger>
      {{ $t('ui.actions.create') }}
    </template>

    <template #content="{ closeModal }">
      <MediaListForm
        :save-button-text="$t('ui.actions.create')"
        :initial-value="{
          title: '',
          isPublic: true,
          poster: ''
        }"
        :is-loading="isUpdatingMediaList || isCreatingMediaList"
        @on-click-save="handleCreateMediaList"
        @on-click-cancel="closeModal"
      />
    </template>
  </UiModal>
</template>

<style lang="scss" module>

</style>
