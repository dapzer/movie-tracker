<script setup lang="ts">
import type { MediaItemType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed, ref } from "vue"
import { CreateMediaListModal } from "~/entities/mediaList"
import MediaItemChangeMediaListForm from "~/features/mediaCard/ui/changeMediaListModal/MediaItemChangeMediaListForm.vue"
import { getCurrentMediaDetails } from "~/utils/getCurrentMediaDetails"
import { UiButton } from "../~/shared/ui/UiButton"
import { UiIcon } from "../~/shared/ui/UiIcon"
import { UiModal } from "../~/shared/ui/UiModal"

interface MediaItemChangeMediaListModalProps {
  mediaItem: MediaItemType
}

const props = defineProps<MediaItemChangeMediaListModalProps>()
const model = defineModel<boolean>()
const { locale } = useI18n()
const isOpenModal = ref(model)
const isOpenCreateModal = ref(false)

const currentMediaDetails = computed(() => {
  return getCurrentMediaDetails(props.mediaItem.mediaDetails, locale.value)
})
</script>

<template>
  <UiModal
    v-model="isOpenModal"
    :title="$t('mediaItem.changeMediaList.title')"
    :description="$t('mediaItem.changeMediaList.description', { title: currentMediaDetails?.title || currentMediaDetails?.originalTitle,
    })"
    :max-width="495"
  >
    <template #content>
      <MediaItemChangeMediaListForm
        v-model="model"
        :media-item="props.mediaItem"
      >
        <template #action>
          <UiButton
            with-icon
            :class="$style.createListButton"
            scheme="secondary"
            size="medium"
            @click="isOpenCreateModal = true"
          >
            {{ $t('mediaList.create') }}
            <UiIcon name="icon:plus" />
          </UiButton>
        </template>
      </MediaItemChangeMediaListForm>
    </template>
  </UiModal>
  <CreateMediaListModal v-model="isOpenCreateModal" />
</template>

<style module lang="scss">
.createListButton {
  white-space: nowrap;
}
</style>
