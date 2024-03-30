<script lang="ts" setup>

import { UiModal } from "~/components/ui/UiModal";
import { type MediaDetailsType, MediaTypeEnum } from "@movie-tracker/types";
import MediaItemCreateCloneModalForm from "~/features/mediaItem/ui/createCloneModal/MediaItemCreateCloneModalForm.vue";

interface MediaItemCreateCloneModalProps {
  mediaId: number;
  mediaType: MediaTypeEnum;
  mediaItemId: string;
  mediaDetails?: MediaDetailsType;
}

const props = defineProps<MediaItemCreateCloneModalProps>();

</script>

<template>
  <UiModal
    :class="$style.button"
    :max-width="500"
    :title="$t('mediaItem.createClone.title')"
    button-variant="clear"
  >
    <template #trigger>
      {{ $t("mediaItem.createClone.button") }}
    </template>

    <template #content="{ closeModal }">
      <MediaItemCreateCloneModalForm
        :close-modal="closeModal"
        :media-details="props.mediaDetails"
        :media-id="props.mediaId"
        :media-item-id="props.mediaItemId"
        :media-type="props.mediaType"
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
