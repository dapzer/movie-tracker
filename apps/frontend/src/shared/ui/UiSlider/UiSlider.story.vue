<script setup lang="ts">
import { UiVideoCard } from "~/shared/ui/UiCard"
import UiSlider from "~/shared/ui/UiSlider/UiSlider.vue"
import { getPlaceholderImageUrl } from "~/shared/utils/getPlaceholderImageUrl"
</script>

<template>
  <Story
    group="ui-kit"
    title="UiSlider"
  >
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
