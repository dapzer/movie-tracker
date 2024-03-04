<script lang="ts" setup>
import { type MediaItemType } from "@movie-tracker/types";
import { UiModal } from "~/components/ui/UiModal";
import MediaItemChangeMediaListForm from "~/features/mediaItem/ui/changeMediaList/MediaItemChangeMediaListForm.vue";

interface MediaItemChangeMediaListModalProps {
  mediaItem: MediaItemType;
}

const props = defineProps<MediaItemChangeMediaListModalProps>();
</script>

<template>
  <UiModal
    :class="$style.button"
    :max-width="500"
    :title="$t('mediaItem.changeMediaList.title')"
    button-variant="clear"
  >
    <template #trigger>
      {{ $t("mediaItem.changeMediaList.button") }}
    </template>

    <template #content="{ closeModal }">
      <MediaItemChangeMediaListForm
        :close-modal="closeModal"
        :media-item="props.mediaItem"
      />
    </template>
  </UiModal>
</template>

<style lang="scss" module>
.button {
  font-size: 1em;
  font-weight: var(--fw-regular);
  font-family: Arial Roboto, sans-serif;
  width: 100%;
}
</style>
