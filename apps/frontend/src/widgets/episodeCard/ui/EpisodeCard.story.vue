<script setup lang="ts">

import EpisodeCard from '~/widgets/episodeCard/ui/EpisodeCard.vue';
import { getPlaceholderImageUrl } from '~/utils/getPlaceholderImageUrl';
</script>

<template>
  <Story
    group="widgets"
    title="EpisodeCard"
  >
    <template #default>
      <EpisodeCard
        title="Episode name"
        :season="1"
        :episode="1"
        description="Rick and Morty"
        :image-src="getPlaceholderImageUrl(250, 157)"
      />
    </template>
  </Story>
</template>

<style module lang="scss">

</style>
