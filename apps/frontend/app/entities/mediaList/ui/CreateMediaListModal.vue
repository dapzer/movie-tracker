<script setup lang="ts">
import type { MediaListUpdateApiTypes } from "~/api/mediaList/mediaListApiTypes"
import { useI18n } from "#imports"
import { toast } from "vue3-toastify"
import { useCreateMediaListApi } from "~/api/mediaList/useMediaListApi"
import MediaListForm from "~/entities/mediaList/ui/MediaListForm.vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiModal } from "~/shared/ui/UiModal"

const slots = defineSlots()
const model = defineModel<boolean>()
const { t } = useI18n()
const createMediaListApi = useCreateMediaListApi()

async function handleCreateMediaList(value: MediaListUpdateApiTypes) {
  await createMediaListApi.mutateAsync(value).then(() => {
    toast.success(t("toasts.mediaList.successCreated"))
    model.value = false
  }).catch(() => {
    toast.error(t("toasts.mediaList.unsuccessfullyCreated"))
  })
}
</script>

<template>
  <UiModal
    v-model="model"
    :max-width="495"
    :title="$t('mediaList.create')"
  >
    <template
      v-if="slots.trigger"
      #trigger="{ openModal }"
    >
      <slot
        name="trigger"
        :open-modal="openModal"
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
