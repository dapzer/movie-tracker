<script setup lang="ts">

import UiConfirmationModal from "~/components/newUi/UiConfirmationModal/UiConfirmationModal.vue"
import { UiButton } from "~/components/newUi/UiButton"
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
