<script setup lang="ts">
import type { UserProfileRatingsSortOption } from "~/features/profile/ui/tabs/UserProfileRatings.vue"
import type { UiOptionPickerOption } from "~/shared/ui/UiOptionPicker"
import { useI18n } from "#imports"
import { computed, h } from "vue"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiOptionPicker } from "~/shared/ui/UiOptionPicker"

const { t } = useI18n()
const sortTypeModel = defineModel<UserProfileRatingsSortOption>()

const sortArrowUpIcon = h(UiIcon, { name: "icon:arrow-up-with-list", size: 20 })
const sortArrowDownIcon = h(UiIcon, { name: "icon:arrow-down-with-list", size: 20 })

const options = computed<Array<UiOptionPickerOption>>(() => {
  return [
    {
      label: t("ui.sort.createdAt"),
      value: "asc_createdAt",
      icon: sortArrowUpIcon,
    },
    {
      label: t("ui.sort.createdAt"),
      value: "desc_createdAt",
      icon: sortArrowDownIcon,
    },
    {
      label: t("ui.sort.rating"),
      value: "asc_rating",
      icon: sortArrowUpIcon,
    },
    {
      label: t("ui.sort.rating"),
      value: "desc_rating",
      icon: sortArrowDownIcon,
    },
  ]
})
</script>

<template>
  <UiOptionPicker
    v-model="sortTypeModel"
    :options="options"
    compact-icon="icon:sort"
  />
</template>
