<script lang="ts" setup>
import { useCreateMediaListApi, useI18n, useUpdateMediaListApi } from "#imports";
import { UiModal } from "~/components/ui/UiModal";
import { computed, ref } from "vue";
import MediaListForm from "~/features/mediaList/ui/MediaListForm.vue";
import type { MediaListUpdateApiTypes } from "~/types/mediaListApiTypes";
import { toast } from "vue3-toastify";

const {t} = useI18n()

const createMediaListApi = useCreateMediaListApi();

const isCreatingMediaList = computed(() => createMediaListApi.status.value === "pending");
const createModalRef = ref<InstanceType<typeof UiModal> | null>(null);

const handleCreateMediaList = async (value: MediaListUpdateApiTypes) => {
  await createMediaListApi.mutateAsync(value).then(() => {
    toast.success(t('toasts.mediaList.successCreated'));
  })
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
        :is-loading="isCreatingMediaList"
        @on-click-save="handleCreateMediaList"
        @on-click-cancel="closeModal"
      />
    </template>
  </UiModal>
</template>

<style lang="scss" module>

</style>
