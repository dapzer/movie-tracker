<script setup lang="ts">
import { useI18n } from "#imports"
import { computed } from "vue"
import { UiFilterTrigger } from "~/shared/ui/UiFilterTrigger"
import { UiPopover } from "~/shared/ui/UiPopover"
import CheckboxList from "~/widgets/mediaList/ui/filters/CheckboxList.vue"

const { t } = useI18n()

const genres = defineModel<string[]>({ default: () => [] })

const genreOptions = computed(() => {
  return [
    { value: "80", label: t("details.genres.movie.80") },
    { value: "16", label: t("details.genres.movie.16") },
    { value: "53", label: t("details.genres.movie.53") },
    { value: "37", label: t("details.genres.movie.37") },
    { value: "878", label: t("details.genres.movie.878") },
    { value: "14", label: t("details.genres.movie.14") },
    { value: "27", label: t("details.genres.movie.27") },
    { value: "18", label: t("details.genres.movie.18") },
    { value: "28", label: t("details.genres.movie.28") },
    { value: "35", label: t("details.genres.movie.35") },
  ]
})

const isActive = computed(() => genres.value.length > 0)

function clearGenres() {
  genres.value = []
}
</script>

<template>
  <UiPopover
    as-child
    :width="265"
    :content-spacing="0"
    :indent="10"
  >
    <template #trigger>
      <UiFilterTrigger
        :active="isActive"
        @clear="clearGenres"
      >
        {{ t("mediaList.filters.genres") }}
      </UiFilterTrigger>
    </template>
    <template #content>
      <CheckboxList
        v-model="genres"
        :options="genreOptions"
      />
    </template>
  </UiPopover>
</template>

<style module lang="scss">
.popoverContent {
  display: flex;
  flex-direction: column;
}

.checkboxOption {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
</style>
