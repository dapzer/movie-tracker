<script setup lang="ts">
import { useI18n } from "#imports"
import { DataImportSourceEnum } from "@movie-tracker/types"
import { computed } from "vue"
import { UiSelect } from "~/shared/ui/UiSelect"

const source = defineModel<DataImportSourceEnum | undefined>()

const { t } = useI18n()

const options = computed(() => [
  {
    value: DataImportSourceEnum.LETTERBOXD,
    label: t("dataImport.sources.letterboxd"),
  },
  {
    value: DataImportSourceEnum.TRAKT,
    label: t("dataImport.sources.trakt"),
  },
])
</script>

<template>
  <UiSelect
    v-model="source"
    :class="$style.select"
    :options="options"
    :placeholder="$t('dataImport.sourcePlaceholder')"
  />
</template>

<style module lang="scss">
.select {
  width: 100%;
}
</style>
