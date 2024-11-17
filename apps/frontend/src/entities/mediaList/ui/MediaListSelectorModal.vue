<script setup lang="ts">

import { ref } from "vue"
import { ListIcon } from "~/components/ui/icons"
import { UiButton } from "~/components/newUi/UiButton"
import AddMediaItemToListsModal from "~/entities/mediaList/ui/addMediaItemToLists/AddMediaItemToListsModal.vue"
import { MediaTypeEnum, TmdbMediaTypeEnum } from "@movie-tracker/types"
import { CreateMediaListModal } from "~/entities/mediaList"
import { PlusIcon } from "~/components/ui/icons.js"
import { useAuth } from "#imports"
import { useNavigateToSignInPage } from "~/composables/useNavigateToSignInPage"
import { useSwitchModals } from "~/composables/useSwitchModals"

interface MediaListSelectorItemProps {
  mediaId: number;
  mediaType: TmdbMediaTypeEnum | MediaTypeEnum;
  hideTrigger?: boolean;
}

const props = defineProps<MediaListSelectorItemProps>();
const { isAuthorized } = useAuth()
const { navigateToSignInPage } = useNavigateToSignInPage()
const model = defineModel<boolean>()

const isOpenModal = ref(model);
const isOpenCreateModal = ref(false);

const { onOpenSecondModal } = useSwitchModals(isOpenModal, isOpenCreateModal);

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
    v-if="!props.hideTrigger"
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
        @click="onOpenSecondModal"
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
