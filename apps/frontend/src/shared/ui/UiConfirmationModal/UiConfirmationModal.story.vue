<script setup lang="ts">

import UiConfirmationModal from "~/shared/ui/UiConfirmationModal/UiConfirmationModal.vue"
import { UiButton } from "~/shared/ui/UiButton"
</script>

<template>
  <Story
    title="UiConfirmationModal"
    group="ui-kit"
  >
    <template #default>
      <UiConfirmationModal
        title="Are you sure?"
        description="Some description"
      >
        <template #trigger="{ openModal }">
          <UiButton @click="openModal">
            Open modal
          </UiButton>
        </template>
      </UiConfirmationModal>
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
