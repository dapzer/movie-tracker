<script lang="ts" setup>

import { useRoute } from "vue-router";
import { TmdbMediaTypeEnum } from "@movie-tracker/types";
import { computed } from "#imports";
import { MovieDetails, PersonDetails } from "~/features/details";

const route = useRoute();
const mediaType = computed(() => route.params.mediaType);
const mediaId = computed(() => route.params.mediaId);
</script>

<template>
  <MovieDetails
    v-if="mediaType !== TmdbMediaTypeEnum.PERSON"
    :media-id="Number(mediaId)"
    :media-type="mediaType as TmdbMediaTypeEnum"
  />
  <PersonDetails
    v-else
    :media-id="Number(mediaId)"
  />
</template>

<style lang="scss" module>
</style>
