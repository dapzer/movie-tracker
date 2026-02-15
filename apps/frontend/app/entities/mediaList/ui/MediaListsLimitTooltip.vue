<script setup lang="ts">
import { MEDIA_LIST_COUNT_LIMIT } from "@movie-tracker/types"
import { computed } from "vue"
import { useGetMediaListsApi } from "~/api/mediaList/useMediaListApi"
import { UiLimit } from "~/shared/ui/UiLimit"
import { UiTooltip } from "~/shared/ui/UiTooltip"
import { UiTypography } from "~/shared/ui/UiTypography"

const getMediaListsApi = useGetMediaListsApi()

const currentListsCount = computed(() => {
  return getMediaListsApi.data.value?.length || 0
})

const isLimitReached = computed(() => {
  return currentListsCount.value >= MEDIA_LIST_COUNT_LIMIT
})
</script>

<template>
  <UiTooltip
    align="end"
    :disabled="!isLimitReached"
  >
    <template #trigger>
      <slot :is-limit-reached="isLimitReached || getMediaListsApi.isFetching.value" />
    </template>
    <template #content>
      <div :class="$style.wrapper">
        <div :class="$style.header">
          <UiTypography
            :class="$style.title"
            variant="description"
          >
            {{ $t("mediaList.limitReached") }}
          </UiTypography>
          <UiLimit
            :limit="MEDIA_LIST_COUNT_LIMIT"
            :current="currentListsCount"
          />
        </div>
        <UiTypography
          :class="$style.description"
          variant="badge"
        >
          {{ $t("mediaList.limitReachedDescription", { limit: MEDIA_LIST_COUNT_LIMIT }) }}
        </UiTypography>
      </div>
    </template>
  </UiTooltip>
</template>

<style module lang="scss">
.wrapper {
  width: 100%;
  max-width: 272px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.title {
  color: var(--c-text);
  font-weight: var(--fw-medium);
}

.description {
  color: var(--c-white-60);
}
</style>
