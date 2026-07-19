<script setup lang="ts">
import { useDebouncedSearchTerm } from "~/shared/composables/useDebouncedSearchTerm"
import { UiExpandableSearchInput } from "~/shared/ui/UiExpandableSearchInput"

const searchTerm = defineModel<string>("searchTerm", { default: "" })

const { searchValue } = useDebouncedSearchTerm(searchTerm)
</script>

<template>
  <div :class="$style.wrapper">
    <UiExpandableSearchInput
      v-model="searchValue"
      :wrapper-class="$style.searchInput"
      :placeholder="$t('users.filters.searchPlaceholder')"
    />
  </div>
</template>

<style module lang="scss">
.wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.searchInput {
  width: fit-content;
  max-width: 260px;
}
</style>
