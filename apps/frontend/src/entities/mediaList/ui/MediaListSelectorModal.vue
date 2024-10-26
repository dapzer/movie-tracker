<script setup lang="ts">

import { ref, watch } from "vue"
import { ListIcon } from "~/components/ui/icons"
import { UiButton } from "~/components/newUi/UiButton"
import AddMediaItemToListsModal from "~/entities/mediaList/ui/addMediaItemToLists/AddMediaItemToListsModal.vue"
import { MediaTypeEnum, TmdbMediaTypeEnum } from "@movie-tracker/types"
import { CreateMediaListModal } from "~/entities/mediaList"
import { PlusIcon } from "~/components/ui/icons.js"
import { nextTick, useAuth } from "#imports"
import { useNavigateToSignInPage } from "~/composables/useNavigateToSignInPage"

interface MediaListSelectorItemProps {
  mediaId: number;
  mediaType: TmdbMediaTypeEnum | MediaTypeEnum;
}

const props = defineProps<MediaListSelectorItemProps>();
const { isAuthorized } = useAuth()
const { navigateToSignInPage } = useNavigateToSignInPage()

const isOpenModal = ref(false);
const isOpenCreateModal = ref(false);

watch(() => isOpenCreateModal.value, (value) => {
  if (!value) {
    nextTick(() => {
      isOpenModal.value = true;
    });
  }
});

const onOpenCreateModal = () => {
  isOpenModal.value = false;
  nextTick(() => {
    isOpenCreateModal.value = true;
  });
}

const onOpenButtonClicked = () => {
  if (!isAuthorized.value) {
    navigateToSignInPage();
    return;
  }

  isOpenModal.value = true;
}
</script>

<template>
  <UiButton
    :class="$style.addToListButton"
    variant="boxed"
    @click="onOpenButtonClicked"
  >
    <ListIcon />
    {{ $t('mediaList.addToList') }}
  </UiButton>

  <AddMediaItemToListsModal
    v-model="isOpenModal"
    :media-id="props.mediaId"
    :media-type="props.mediaType"
  >
    <template #action>
      <UiButton
        with-icon
        :class="$style.createListButton"
        scheme="secondary"
        size="medium"
        @click="onOpenCreateModal"
      >
        {{ $t('mediaList.create') }}
        <PlusIcon />
      </UiButton>
    </template>
  </AddMediaItemToListsModal>

  <CreateMediaListModal v-model="isOpenCreateModal" />
</template>

<style module lang="scss">
.addToListButton {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: var(--fs-label-small) !important;
}

.createListButton {
  white-space: nowrap;
}
</style>
