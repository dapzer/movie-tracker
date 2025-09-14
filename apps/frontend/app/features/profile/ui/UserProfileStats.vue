<script setup lang="ts">
import type { UserStatsType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed } from "vue"
import { UiSlider } from "~/shared/ui/UiSlider"
import { UiTypography } from "~/shared/ui/UiTypography"

interface UserProfileStatsProps {
  stats: UserStatsType
}

const props = defineProps<UserProfileStatsProps>()

const { t } = useI18n()

const columns = computed(() => {
  return [
    {
      label: t("userProfile.stats.mediaListCount"),
      value: props.stats.mediaListCount,
    },
    {
      label: t("userProfile.stats.mediaListLikeCount"),
      value: props.stats.mediaListLikeCount,
    },
    {
      label: t("userProfile.stats.mediaRatingsCount"),
      value: props.stats.mediaRatingsCount,
    },
  ]
})
</script>

<template>
  <UiSlider
    :class="$style.wrapper"
    :data="columns"
    :spaceing="48"
    max-width="max-content"
    hide-buttons
  >
    <template #slide="{ item }">
      <div :class="$style.column">
        <UiTypography variant="title3">
          {{ item.value }}
        </UiTypography>
        <UiTypography variant="description">
          {{ item.label }}
        </UiTypography>
      </div>
    </template>
  </UiSlider>
</template>

<style module lang="scss">
@import "~/shared/styles/breakpoints";
@import "~/shared/styles/mixins";

.wrapper {
  width: fit-content !important;

  @include mobileDevice() {
    --slide-spacing: 40px !important;
  }
}

.column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}
</style>
