<script setup lang="ts">
import type { MediaListType } from "@movie-tracker/types"
import { ref } from "vue"
import CloneMediaListForm from "~/entities/mediaList/ui/cloneMediaList/CloneMediaListForm.vue"
import { UiModal } from "~/shared/ui/UiModal"

interface CloneMediaListModalProps {
  mediaList: MediaListType
}

const props = defineProps<CloneMediaListModalProps>()

const slots = defineSlots()
const model = defineModel<boolean>()
const isModalOpen = ref(model.value ?? false)
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
      #trigger="{ openModal }"
    >
      <slot
        name="trigger"
        :open-modal="openModal"
      />
    </template>

    <template #content>
      <CloneMediaListForm
        v-model="isModalOpen"
        :media-list="props.mediaList"
      />
    </template>
  </UiModal>
</template>

<style scoped lang="scss">

</style>
