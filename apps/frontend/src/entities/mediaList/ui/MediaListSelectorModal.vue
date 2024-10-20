<script setup lang="ts">

import { ref } from "vue"
import { ListIcon } from "~/components/ui/icons"
import { UiButton } from "~/components/newUi/UiButton"
import AddMediaItemToListsModal from "~/entities/mediaList/ui/addMediaItemToLists/AddMediaItemToListsModal.vue"
import { MediaTypeEnum, TmdbMediaTypeEnum } from "@movie-tracker/types"

interface MediaListSelectorItemProps {
  mediaId: number;
  mediaType: TmdbMediaTypeEnum | MediaTypeEnum;
}

const props = defineProps<MediaListSelectorItemProps>();

const isOpenModal = ref(false);
const isOpenCreateModal = ref(false);

const afterCreateNewList = () => {
  isOpenCreateModal.value = false;
  isOpenModal.value = true;
}
</script>

<template>
  <UiButton
    :class="$style.addToListButton"
    variant="boxed"
    @click="isOpenModal = true"
  >
    <ListIcon />
    {{ $t('mediaList.addToList') }}
  </UiButton>

  <AddMediaItemToListsModal
    v-model="isOpenModal"
    :media-id="props.mediaId"
    :media-type="props.mediaType"
  />
</template>

<style module lang="scss">
.addToListButton {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: var(--fs-label-small) !important;
}
</style>
