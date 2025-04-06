<script setup lang="ts">
import { ref } from "vue"
import { UiMediaCard } from "~/shared/ui/UiCard"
import UiCardsGrid from "~/shared/ui/UiCardsGrid/UiCardsGrid.vue"
import { getPlaceholderImageUrl } from "~/shared/utils/getPlaceholderImageUrl"

const cardCount = ref(20)
</script>

<template>
  <Story
    title="UiCardsGrid"
    group="ui-kit"
  >
    <template #default>
      <UiCardsGrid>
        <UiMediaCard
          v-for="i in cardCount"
          :key="i"
          full-height
          :image-src="getPlaceholderImageUrl(179, 277)"
          description="Jan 07 2024, USA"
          :title="`Movie Title ${i + 1}`"
          link-url=""
        />
      </UiCardsGrid>
    </template>

    <template #controls>
      <HstNumber
        v-model="cardCount"
        :step="1"
        title="Card Count"
      />
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
