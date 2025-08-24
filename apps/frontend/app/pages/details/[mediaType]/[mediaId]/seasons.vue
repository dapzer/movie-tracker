<script setup lang="ts">
import { definePageMeta } from "#imports"
import { TmdbMediaTypeEnum } from "@movie-tracker/types"
import { useRoute } from "vue-router"
import { getValidationForMediaDetailsParams } from "~/shared/utils/getValidationForMediaDetailsParams"
import { TvDetailsSeasons } from "~/widgets/details"

definePageMeta({
  validate: getValidationForMediaDetailsParams([TmdbMediaTypeEnum.TV]),
})

const route = useRoute()
const mediaId = route.params.mediaId
</script>

<template>
  <TvDetailsSeasons :media-id="Number(mediaId)" />
</template>

<style module lang="scss">

</style>
