<script setup lang="ts">

import { UiModal } from "~/components/newUi/UiModal"
import MediaListForm from "~/entities/mediaList/ui/MediaListForm.vue"
import { UiButton } from "~/components/newUi/UiButton"
import type { MediaListUpdateApiTypes } from "~/api/mediaList/mediaListApiTypes"
import { toast } from "vue3-toastify"
import { useI18n } from "#imports"
import { useCreateMediaListApi } from "~/api/mediaList/useMediaListApi"

const model = defineModel<boolean>()
const slots = defineSlots()
const { t } = useI18n();
const createMediaListApi = useCreateMediaListApi();

const handleCreateMediaList = async (value: MediaListUpdateApiTypes) => {
  await createMediaListApi.mutateAsync({ ...value, poster: '' }).then(() => {
    toast.success(t("toasts.mediaList.successCreated"));
    model.value = false;
  }).catch(() => {
    toast.error(t("toasts.mediaList.unsuccessfullyCreated"));
  });
};

</script>

<template>
  <UiModal
    v-model="model"
    :max-width="495"
    :title="$t('mediaList.create')"
  >
    <template
      v-if="slots.trigger"
      #trigger="{openModal}"
    >
      <slot
        name="trigger"
        :openModal="openModal"
      />
    </template>

    <template #content>
      <MediaListForm @on-submit="handleCreateMediaList">
        <template #actions>
          <UiButton
            :disabled="createMediaListApi.isPending.value"
            size="small"
            type="submit"
          >
            {{ $t('ui.actions.create') }}
          </UiButton>
        </template>
      </MediaListForm>
    </template>
  </UiModal>
</template>

<style module lang="scss">
</style>
