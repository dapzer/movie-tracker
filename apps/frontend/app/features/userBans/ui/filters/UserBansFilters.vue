<script setup lang="ts">
import type { UserBanStatusFilter } from "@movie-tracker/types"
import UserBansExpiredFilterPopover from "~/features/userBans/ui/filters/UserBansExpiredFilterPopover.vue"
import { useDebouncedSearchTerm } from "~/shared/composables/useDebouncedSearchTerm"
import { UiExpandableSearchInput } from "~/shared/ui/UiExpandableSearchInput"

const userId = defineModel<string>("userId", { default: "" })
const statuses = defineModel<UserBanStatusFilter[]>("statuses", { default: () => [] })

const { searchValue } = useDebouncedSearchTerm(userId)
</script>

<template>
  <div :class="$style.wrapper">
    <UiExpandableSearchInput
      v-model="searchValue"
      :wrapper-class="$style.searchInput"
      :placeholder="$t('userBans.filters.userIdPlaceholder')"
    />

    <UserBansExpiredFilterPopover v-model="statuses" />
  </div>
</template>

<style module lang="scss">
.wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.searchInput {
  width: fit-content;
  max-width: 300px;
}
</style>
