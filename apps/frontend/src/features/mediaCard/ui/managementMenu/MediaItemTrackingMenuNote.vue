<script setup lang="ts">
import type { MediaItemType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { MEDIA_ITEM_TRACKING_NOTE_MAX_LENGTH } from "@movie-tracker/types"
import { computed, ref } from "vue"
import { toast } from "vue3-toastify"
import { useUpdateMediaItemTrackingDataApi } from "~/api/mediaItem/useMediaItemtApi"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiTextarea } from "~/shared/ui/UiTextarea"
import { UiTypography } from "~/shared/ui/UiTypography"

interface MediaItemTrackingMenuProps {
  mediaItem: MediaItemType
}

const props = defineProps<MediaItemTrackingMenuProps>()
const { t } = useI18n()
const updateMediaItemTrackingDataApi = useUpdateMediaItemTrackingDataApi()
const value = ref(props.mediaItem.trackingData.note || "")

const currentNote = computed(() => {
  return props.mediaItem.trackingData.note
})

const isActiveControls = computed(() => {
  return !updateMediaItemTrackingDataApi.isPending.value && currentNote.value !== value.value
})

async function handleSave() {
  await updateMediaItemTrackingDataApi.mutateAsync({
    trackingDataId: props.mediaItem.trackingData.id,
    body: {
      ...props.mediaItem.trackingData,
      note: value.value,
    },
  }).then(() => {
    toast.success(t("toasts.mediaItem.successNoteChanged"))
  }).catch(() => {
    toast.error(t("toasts.mediaItem.unsuccessfullyNoteChanged"))
  })
}

function handleCancel() {
  value.value = currentNote.value
}
</script>

<template>
  <div :class="$style.wrapper">
    <UiTextarea
      v-model="value"
      :disabled="updateMediaItemTrackingDataApi.isPending.value"
      :maxlength="MEDIA_ITEM_TRACKING_NOTE_MAX_LENGTH"
      :placeholder="$t('mediaItem.trackingMenu.tabs.note')"
    />
    <div :class="$style.footer">
      <UiTypography variant="description">
        {{ $t("ui.characters") }}: {{ value.length }} / {{ MEDIA_ITEM_TRACKING_NOTE_MAX_LENGTH }}
      </UiTypography>
      <div :class="$style.actions">
        <UiButton
          :disabled="!isActiveControls"
          scheme="secondary"
          @click="handleSave"
        >
          <UiIcon
            name="icon:check"
            :size="14"
          />
        </UiButton>

        <UiButton
          :disabled="!isActiveControls"
          scheme="tertiary"
          @click="handleCancel"
        >
          <UiIcon name="icon:cross-fiilled" />
        </UiButton>
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    .actions {
      display: flex;
      gap: 4px;

      button {
        height: 24px;
        padding: 4px 8px;
      }
    }
  }
}
</style>
