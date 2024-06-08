<script lang="ts" setup>
import { Hero } from "~/widgets/hero";
import { SearchContent } from "~/features/search";
import { computed, defineBreadcrumb, useI18n, useSchemaOrg } from "#imports";
import { searchStore } from "~/stores/searcStore";
import { isOnlySpaces } from "@movie-tracker/utils";
import { PopularLists } from "~/widgets/popularLists";
import { useLocalePath } from "#i18n";

const { t } = useI18n();
const localePath = useLocalePath();

const searchTerm = computed(() => searchStore.state.searchValue);

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: t("navigation.lists"), item: localePath("/lists") }
    ]
  })
]);

</script>

<template>
  <Hero />
  <SearchContent />
  <PopularLists v-if="!searchTerm || isOnlySpaces(searchTerm)" />
</template>

<style lang="scss" module></style>
