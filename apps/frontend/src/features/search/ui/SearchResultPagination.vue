<script setup lang="ts">

import { UiPagination } from "../../../shared/ui/UiPagination"

interface SearchResultPaginationProps {
  totalPages: number;
}

const props = defineProps<SearchResultPaginationProps>()
const model = defineModel<number>({ default: 1 })
</script>

<template>
  <template v-if="props.totalPages > 1">
    <UiPagination
      v-model="model"
      :class="$style.wrapper"
      :pages-on-sides="1"
      :items-per-page="20"
      :total-items="props.totalPages * 20"
    />
  </template>
</template>

<style module lang="scss">
.wrapper {
  margin-top: 30px;
}
</style>
