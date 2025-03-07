<script setup lang="ts">

import { UiModal } from "../../../shared/ui/UiModal"
import MediaListForm from "~/entities/mediaList/ui/MediaListForm.vue"
import { UiButton } from "../../../shared/ui/UiButton"
import type { MediaListUpdateApiTypes } from "~/api/mediaList/mediaListApiTypes"
import { toast } from "vue3-toastify"
import { useI18n } from "#imports"
import { useDeleteMediaListApi, useUpdateMediaListApi } from "~/api/mediaList/useMediaListApi"
import type { MediaListType } from "@movie-tracker/types"
import { useRouter } from "vue-router"
import { useLocalePath } from "#i18n"
import { UiConfirmationModal } from "../../../shared/ui/UiConfirmationModal"
import { UiIcon } from "../../../shared/ui/UiIcon"

interface EditMediaListModalProps {
  mediaList: MediaListType
}

const props = defineProps<EditMediaListModalProps>()
const model = defineModel<boolean>()
const slots = defineSlots()
const { t } = useI18n();
const localePath= useLocalePath()
const updateMediaListApi = useUpdateMediaListApi();
const deleteMediaListApi = useDeleteMediaListApi();
const router = useRouter();

const handleUpdateMediaList = async (value: MediaListUpdateApiTypes) => {
  await updateMediaListApi.mutateAsync({ mediaListId: props.mediaList.id, body: value }).then(() => {
    toast.success(t("toasts.mediaList.successUpdated"));
    model.value = false;
  }).catch(() => {
    toast.error(t("toasts.mediaList.unsuccessfullyUpdated"));
  });
};

const handleDeleteMediaList = async () => {
  await deleteMediaListApi.mutateAsync(props.mediaList.id).then(() => {
    toast.success(t("toasts.mediaList.successDeleted"));
    model.value = false;
    router.push(localePath('lists'))
  }).catch(() => {
    toast.error(t("toasts.mediaList.unsuccessfullyDeleted"));
  });
};

</script>

<template>
  <UiModal
    v-model="model"
    :max-width="495"
    :title="$t('mediaList.editList')"
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
      <MediaListForm
        :initial-value="{
          title: props.mediaList.isSystem ? $t('mediaList.favorites'): props.mediaList.title,
          description: props.mediaList.description,
          isPublic: props.mediaList.isPublic,
        }"
        :is-system="props.mediaList.isSystem"
        @on-submit="handleUpdateMediaList"
      >
        <template #actions>
          <div :class="$style.actions">
            <UiConfirmationModal
              :title="$t('mediaList.confirmDeleteTitle')"
              :description="$t('mediaList.confirmDeleteDescription', { title: props.mediaList.title })"
              :confirm-text="$t('ui.actions.delete')"
              scheme="danger"
              @confirm="handleDeleteMediaList"
            >
              <template #trigger="{openModal}">
                <UiButton
                  :disabled="updateMediaListApi.isPending.value || deleteMediaListApi.isPending.value || props.mediaList.isSystem"
                  size="small"
                  scheme="tertiary"
                  with-icon
                  type="button"
                  @click="openModal"
                >
                  <UiIcon
                    name="icon:trash"
                    :size="19"
                  />
                  {{ $t('mediaList.deleteList') }}
                </UiButton>
              </template>
            </UiConfirmationModal>
            <UiButton
              :disabled="updateMediaListApi.isPending.value || deleteMediaListApi.isPending.value"
              size="small"
              type="submit"
            >
              {{ $t('ui.actions.saveChanges') }}
            </UiButton>
          </div>
        </template>
      </MediaListForm>
    </template>
  </UiModal>
</template>

<style module lang="scss">
.actions {
  display: flex;
  gap: 12px;
  width: 100%;
  button {
    width: 100%;
  }
}
</style>
