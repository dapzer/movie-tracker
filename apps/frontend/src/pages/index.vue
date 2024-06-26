<script lang="ts" setup>
import { computed, getPlaceholderImageUrl } from '#imports';
import { searchStore } from '~/stores/searcStore';
import { UiVideoCard } from "~/components/newUi/UiCard"
import UiSlider from "../components/newUi/UiSlider/UiSlider.vue"

const searchTerm = computed(() => searchStore.state.searchValue);
</script>

<template>
  <UiSlider :data="Array(12).fill(0)">
    <template #slide>
      <UiVideoCard
        :preview-src="getPlaceholderImageUrl(279, 157)"
        description="Jan 07 2024"
        title="Video Title"
      />
    </template>
  </UiSlider>
  <!--  <Hero />-->
  <!--  <SearchContent />-->
  <!--  <PopularLists v-if="!searchTerm || isOnlySpaces(searchTerm)" />-->
</template>

<style lang="scss" module></style>
