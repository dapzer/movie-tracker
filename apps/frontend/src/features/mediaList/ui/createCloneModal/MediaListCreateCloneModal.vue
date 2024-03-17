<script setup lang="ts">

import { UiModal } from "~/components/ui/UiModal";
import type { MediaItemType, MediaListType } from "@movie-tracker/types";
import MediaListCreateCloneForm from "~/features/mediaList/ui/createCloneModal/MediaListCreateCloneForm.vue";

interface MediaListCreateCloneModalProps {
  mediaList?: MediaListType
  mediaItems?: MediaItemType[]
}

const props = defineProps<MediaListCreateCloneModalProps>();
</script>

<template>
  <UiModal
    ref="createModalRef"
    :max-width="470"
    :title="$t('mediaList.createClone.title')"
    button-size="small"
    v-bind="$attrs"
  >
    <template #trigger>
      {{ $t('mediaList.createClone.title') }}
    </template>

    <template #content="{ closeModal }">
      <MediaListCreateCloneForm
        :close-modal="closeModal"
        :mediaList="props.mediaList"
        :mediaItems="props.mediaItems"
      />
    </template>
  </UiModal>
</template>

<style module lang="scss">

</style>
