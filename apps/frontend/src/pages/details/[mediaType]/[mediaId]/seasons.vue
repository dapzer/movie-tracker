<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "#imports";
import { TvDetailsSeasons } from "~/widgets/details";

const route = useRoute();
const mediaId = computed(() => route.params.mediaId);
</script>

<template>
  <TvDetailsSeasons :media-id="Number(mediaId)" />
</template>

<style module lang="scss">

</style>
