<script lang="ts" setup>
import { computed } from '#imports';
import { searchStore } from '~/stores/searcStore';

const searchTerm = computed(() => searchStore.state.searchValue);
</script>

<template>
  <!--  <Hero />-->
  <!--  <SearchContent />-->
  <!--  <PopularLists v-if="!searchTerm || isOnlySpaces(searchTerm)" />-->
</template>

<style lang="scss" module></style>
