<script lang="ts" setup>
import { computed } from '#imports';
import { searchStore } from '~/stores/searcStore';
import { Hero } from "~/widgets/hero"
import { Feed } from "~/widgets/feed"

const searchTerm = computed(() => searchStore.state.searchValue);
</script>

<template>
  <Hero />
  <!--  <SearchContent />-->
  <Feed :class="$style.feed" />
</template>

<style lang="scss" module>
.feed {
  margin-top: 60px !important;
}
</style>
