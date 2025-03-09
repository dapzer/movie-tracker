<script lang="ts" setup>
import { TmdbMediaTypeEnum } from "@movie-tracker/types"
import { useRoute } from "vue-router"
import { MovieDetails, PersonDetails } from "~/widgets/details"

const route = useRoute()
const mediaType = route.params.mediaType
const mediaId = route.params.mediaId
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
