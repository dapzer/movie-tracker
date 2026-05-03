<script setup lang="ts">
import { useI18n } from "#imports"
import { computed, ref, watch } from "vue"
import { UiFilterTrigger } from "~/shared/ui/UiFilterTrigger"
import { UiPopover } from "~/shared/ui/UiPopover"
import CheckboxList from "~/widgets/mediaList/ui/filters/CheckboxList.vue"

const { t } = useI18n()

const genres = defineModel<string[]>({ default: () => [] })
const openModel = ref(false)
const draftGenres = ref<string[]>(genres.value)

const genreOptions = computed(() => {
  return [
    "12",
    "14",
    "16",
    "18",
    "27",
    "28",
    "35",
    "36",
    "37",
    "53",
    "80",
    "99",
    "878",
    "9648",
    "10402",
    "10749",
    "10751",
    "10752",
    "10770",
  ].map(el => ({ label: t(`details.genres.all.${el}`), value: el }))
})

const isActive = computed(() => genres.value.length > 0)

function clearGenres() {
  draftGenres.value = []
  genres.value = []
}

watch(openModel, (isOpen) => {
  if (isOpen)
    return

  genres.value = [...draftGenres.value]
})
</script>

<template>
  <UiPopover
    v-model="openModel"
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
        v-model="draftGenres"
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
