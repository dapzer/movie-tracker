<script setup lang="ts">

import UiModal from "~/shared/ui/UiModal/modal/UiModal.vue"
import { UiTypography } from "~/shared/ui/UiTypography"
import { ref } from "vue"
import { UiButton } from "~/shared/ui/UiButton"
import UiModalFullscreen from "~/shared/ui/UiModal/modalFullscreen/UiModalFullscreen.vue"

const visible = ref(false)
</script>

<template>
  <Story
    group="ui-kit"
    title="UiModal"
  >
    <template #default>
      <Variant title="With external state">
        <UiModal
          v-model="visible"
          title="Modal title"
        >
          <template #trigger>
            <UiButton @click="visible = true">
              Open
            </UiButton>
          </template>
          <template #content>
            <UiTypography>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur exercitationem fuga id ipsum
              laudantium
              officia unde! Ab deserunt dignissimos doloremque eaque eos est magni molestias, nobis quo recusandae sed
              voluptatem.
            </UiTypography>
          </template>
        </UiModal>
      </Variant>

      <Variant title="Without external state">
        <UiModal
          title="Modal title"
        >
          <template #trigger="{openModal}">
            <UiButton @click="openModal">
              Open
            </UiButton>
          </template>
          <template #content>
            <UiTypography>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur exercitationem fuga id ipsum
              laudantium
              officia unde! Ab deserunt dignissimos doloremque eaque eos est magni molestias, nobis quo recusandae sed
              voluptatem.
            </UiTypography>
          </template>
        </UiModal>
      </Variant>

      <Variant title="Fullscreen without external state">
        <UiModalFullscreen>
          <template #trigger="{openModal}">
            <UiButton @click="openModal">
              Open
            </UiButton>
          </template>
          <template #content="{closeModal}">
            <UiTypography>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur exercitationem fuga id ipsum
              laudantium
              officia unde! Ab deserunt dignissimos doloremque eaque eos est magni molestias, nobis quo recusandae sed
              voluptatem.
            </UiTypography>
            <UiButton @click="closeModal">
              Close
            </UiButton>
          </template>
        </UiModalFullscreen>
      </Variant>
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
