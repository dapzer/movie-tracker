<script lang="ts" setup>
import { useI18n } from "#imports";
import { UiModal } from "~/components/ui/UiModal";
import { computed, ref } from "vue";
import MediaListForm from "~/features/mediaList/ui/MediaListForm.vue";
import type { MediaListUpdateApiTypes } from "~/api/mediaList/mediaListApiTypes";
import { toast } from "vue3-toastify";
import type { UiModalProps } from "~/components/ui/UiModal/UiModal.vue";
import { useCreateMediaListApi } from "~/api/mediaList/useMediaListApi";

interface MediaListCreateModalProps extends Pick<UiModalProps, "buttonVariant"> {
  buttonText?: string
}

const props = defineProps<MediaListCreateModalProps>();

const { t } = useI18n();

const createMediaListApi = useCreateMediaListApi();

const isCreatingMediaList = computed(() => createMediaListApi.status.value === "pending");
const createModalRef = ref<InstanceType<typeof UiModal> | null>(null);

const handleCreateMediaList = async (value: MediaListUpdateApiTypes) => {
  await createMediaListApi.mutateAsync(value).then(() => {
    toast.success(t("toasts.mediaList.successCreated"));
  });
  createModalRef.value?.handleVisible(false);
};
</script>

<template>
  <UiModal
    ref="createModalRef"
    :button-variant="props.buttonVariant ?? 'default'"
    :max-width="470"
    :title="$t('mediaList.create')"
    button-size="small"
    v-bind="$attrs"
  >
    <template #trigger>
      {{ props.buttonText ?? $t("ui.actions.create") }}
    </template>

    <template #content="{ closeModal }">
      <MediaListForm
        :initial-value="{
          title: '',
          isPublic: true,
          poster: ''
        }"
        :is-loading="isCreatingMediaList"
        :save-button-text="$t('ui.actions.create')"
        @on-click-save="handleCreateMediaList"
        @on-click-cancel="closeModal"
      />
    </template>
  </UiModal>
</template>

<style lang="scss" module>

</style>
