<script lang="ts" setup>
import type { MediaItemType } from "@movie-tracker/types";
import { computed, ref } from "vue";
import { useI18n, watch } from "#imports";
import { useUpdateMediaItemTrackingDataApi } from "~/composables/useMediaItemtApi";
import UiTypography from "~/components/ui/UiTypography.vue";
import UiTextarea from "~/components/ui/UiTextarea.vue";
import { CheckMarkIcon, CloseIcon } from "~/components/ui/icons";
import UiButton from "~/components/ui/UiButton.vue";
import { toast } from "vue3-toastify";

interface TrackingMenuNoteProps {
  mediaItem: MediaItemType;
}

const props = defineProps<TrackingMenuNoteProps>();
const { t } = useI18n();

const updateMediaItemTrackingDataApi
  = useUpdateMediaItemTrackingDataApi();

const maxLength = 250;

const currentNote = ref();

const note = computed(() => {
  return props.mediaItem.trackingData.note;
});

const isActiveControls = computed(() => {
  return !updateMediaItemTrackingDataApi.isPending.value && note.value !== currentNote.value;
});

watch(note, () => {
  currentNote.value = note.value;
}, { immediate: true });

const handleSave = async () => {
  await updateMediaItemTrackingDataApi.mutateAsync({
    trackingDataId: props.mediaItem.trackingData.id,
    body: {
      ...props.mediaItem.trackingData,
      note: currentNote.value
    }
  }).then(() => {
    toast.success(t("toasts.mediaItem.successNoteChanged"));
  })
};

const handleCancel = () => {
  currentNote.value = note.value;
};

</script>

<template>
  <div :class="$style.wrapper">
    <UiTextarea
      v-model="currentNote"
      :maxlength="maxLength"
      :placeholder="$t('mediaItem.trackingMenu.tabs.note')"
    />

    <div :class="$style.footer">
      <UiTypography
        as="span"
        variant="textSmall"
      >
        {{ $t("ui.characters") }}: {{ currentNote.length }} / {{ maxLength }}
      </UiTypography>
      <div :class="$style.controls">
        <UiButton
          :disabled="!isActiveControls"
          color-scheme="success"
          @click="handleSave"
        >
          <CheckMarkIcon />
        </UiButton>

        <UiButton
          :disabled="!isActiveControls"
          color-scheme="danger"
          @click="handleCancel"
        >
          <CloseIcon />
        </UiButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;

  textarea {
    border-radius: 0;
    min-height: 100px;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .controls {
      display: flex;
      align-items: center;
      gap: 6px;

      button {
        height: 30px;
        padding: 6px 12px;
        border-radius: var(--s-border-radius);
        transform: none;

        svg {
          width: 14px;
          height: 14px;
        }

        &:first-of-type {
          svg {
            width: 18px;
            height: unset;
          }
        }
      }
    }
  }
}
</style>
