<script setup lang="ts">
import type { UserBanStatusFilter } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed } from "vue"
import { useDebouncedSearchTerm } from "~/shared/composables/useDebouncedSearchTerm.ts"
import { UiExpandableSearchInput } from "~/shared/ui/UiExpandableSearchInput"
import { UiMultiSelectFilterPopover } from "~/shared/ui/UiMultiSelectFilterPopover"

const userId = defineModel<string>("userId", { default: "" })
const statuses = defineModel<UserBanStatusFilter[]>("statuses", { default: () => [] })

const { t } = useI18n()
const { searchValue } = useDebouncedSearchTerm(userId)

const statusOptions = computed(() => [
  {
    label: t("userBans.filters.status.active"),
    value: "active",
  },
  {
    label: t("userBans.filters.status.expired"),
    value: "expired",
  },
  {
    label: t("userBans.filters.status.revoked"),
    value: "revoked",
  },
])
</script>

<template>
  <div :class="$style.wrapper">
    <UiExpandableSearchInput
      v-model="searchValue"
      :wrapper-class="$style.searchInput"
      :placeholder="$t('userBans.filters.userIdPlaceholder')"
    />

    <UiMultiSelectFilterPopover
      v-model="statuses"
      :title="$t('userBans.filters.status.title')"
      :options="statusOptions"
    />
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
