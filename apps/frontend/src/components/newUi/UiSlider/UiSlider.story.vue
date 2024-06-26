<script setup lang="ts">

import { getPlaceholderImageUrl } from "~/utils/getPlaceholderImageUrl"
import { UiVideoCard } from "~/components/newUi/UiCard"
import UiSlider from "~/components/newUi/UiSlider/UiSlider.vue"
</script>

<template>
  <Story title="UiSlider">
    <template #default>
      <UiSlider :data="Array(12).fill(0)">
        <template #slide>
          <UiVideoCard
            :preview-src="getPlaceholderImageUrl(279, 157)"
            description="Jan 07 2024"
            title="Video Title"
          />
        </template>
      </UiSlider>
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
