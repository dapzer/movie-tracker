<script lang="ts" setup>
import { computed } from '#imports';
import { searchStore } from '~/stores/searcStore';
import { isOnlySpaces } from "@movie-tracker/utils"
import { Hero } from "~/widgets/hero"
import { SearchContent } from "~/features/search"
import { PopularLists } from "~/widgets/popularLists"

const searchTerm = computed(() => searchStore.state.searchValue);
</script>

<template>
  <Hero />
  <SearchContent />
  <PopularLists v-if="!searchTerm || isOnlySpaces(searchTerm)" />
</template>

<style lang="scss" module></style>
