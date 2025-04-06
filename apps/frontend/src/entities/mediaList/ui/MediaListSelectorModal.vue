<script setup lang="ts">
import type { MediaTypeEnum, TmdbMediaTypeEnum } from "@movie-tracker/types"
import { ref } from "vue"
import { CreateMediaListModal } from "~/entities/mediaList"
import AddMediaItemToListsModal from "~/entities/mediaList/ui/addMediaItemToLists/AddMediaItemToListsModal.vue"
import { useAuth } from "~/shared/composables/useAuth"
import { useNavigateToSignInPage } from "~/shared/composables/useNavigateToSignInPage"
import { useSwitchModals } from "~/shared/composables/useSwitchModals"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"

interface MediaListSelectorItemProps {
  mediaId: number
  mediaType: TmdbMediaTypeEnum | MediaTypeEnum
  hideTrigger?: boolean
}

const props = defineProps<MediaListSelectorItemProps>()
const { isAuthorized } = useAuth()
const { navigateToSignInPage } = useNavigateToSignInPage()
const model = defineModel<boolean>()

const isOpenModal = ref(model)
const isOpenCreateModal = ref(false)

const { onOpenSecondModal } = useSwitchModals(isOpenModal, isOpenCreateModal)

function onOpenButtonClicked() {
  if (!isAuthorized.value) {
    navigateToSignInPage()
    return
  }

  isOpenModal.value = true
}
</script>

<template>
  <UiButton
    v-if="!props.hideTrigger"
    :class="$style.addToListButton"
    variant="boxed"
    with-icon
    @click="onOpenButtonClicked"
  >
    <UiIcon
      block
      name="icon:list"
      :width="16"
      :height="16"
    />
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
        <UiIcon name="icon:plus" />
      </UiButton>
    </template>
  </AddMediaItemToListsModal>

  <CreateMediaListModal v-model="isOpenCreateModal" />
</template>

<style module lang="scss">
.addToListButton {
  font-size: var(--fs-label-small) !important;
}

.createListButton {
  white-space: nowrap;
}
</style>
