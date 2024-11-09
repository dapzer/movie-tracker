<script setup lang="ts">

import { UiModal } from "~/components/newUi/UiModal"
import CloneMediaListForm from "~/entities/mediaList/ui/cloneMediaList/CloneMediaListForm.vue"
import { ref } from "vue"
import type { MediaItemType, MediaListType } from "@movie-tracker/types"

interface CloneMediaListModalProps {
  mediaList: MediaListType
  mediaItems: MediaItemType[]
}

const props = defineProps<CloneMediaListModalProps>()

const model = defineModel<boolean>()
const isModalOpen = ref(model.value ?? false)
const slots = defineSlots()
</script>

<template>
  <UiModal
    v-model="isModalOpen"
    :max-width="495"
    :title="$t('mediaList.createClone.title')"
    :description="$t('mediaList.createClone.description')"
  >
    <template
      v-if="slots.trigger"
      #trigger="{openModal}"
    >
      <slot
        name="trigger"
        :openModal="openModal"
      />
    </template>

    <template #content>
      <CloneMediaListForm
        v-model="isModalOpen"
        :media-items="props.mediaItems"
        :media-list="props.mediaList"
      />
    </template>
  </UiModal>
</template>

<style scoped lang="scss">

</style>
