<script setup lang="ts">
import { useI18n } from "#imports"
import { useCreateMediaListApi } from "~/api/mediaList/useMediaListApi"
import { computed, ref } from "vue"
import { UiModal } from "~/components/ui/UiModal"
import type { MediaListUpdateApiTypes } from "~/api/mediaList/mediaListApiTypes"
import { toast } from "vue3-toastify"

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
</template>

<style scoped lang="scss">

</style>
