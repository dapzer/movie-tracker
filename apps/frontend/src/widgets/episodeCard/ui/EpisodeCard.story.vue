<script setup lang="ts">

import EpisodeCard from '~/widgets/episodeCard/ui/EpisodeCard.vue';
</script>

<template>
  <Story title="EpisodeCard">
    <template #default>
      <EpisodeCard
        title="Episode name"
        :season="1"
        :episode="1"
        description="Rick and Morty"
        image-src="https://via.placeholder.com/250x157"
      />
    </template>
  </Story>
</template>

<style module lang="scss">

</style>
