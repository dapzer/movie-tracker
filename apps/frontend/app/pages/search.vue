<script setup lang="ts">
import { useRoute } from "#app"
import { useI18n, useSeoMeta } from "#imports"
import { computed } from "vue"
import { SearchResult } from "~/features/search"

const { t } = useI18n()
const route = useRoute()
const searchTerm = computed(() => route.query.searchTerm as string)

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("search.title")} '${searchTerm.value}' | ${titleChunk}`
  },
  ogTitle() {
    return `%s | ${t("search.title")} '${searchTerm.value}'`
  },
})
</script>

<template>
  <SearchResult />
</template>

<style scoped lang="scss">

</style>
