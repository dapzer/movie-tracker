<script lang="ts" setup>
import { definePageMeta } from "#imports"
import { TmdbMediaTypeEnum } from "@movie-tracker/types"
import { useRoute } from "vue-router"
import { getValidationForMediaDetailsParams } from "~/shared/utils/getValidationForMediaDetailsParams"
import { MovieDetails, PersonDetails } from "~/widgets/details"

definePageMeta({
  validate: getValidationForMediaDetailsParams([TmdbMediaTypeEnum.TV, TmdbMediaTypeEnum.MOVIE, TmdbMediaTypeEnum.PERSON]),
})
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
