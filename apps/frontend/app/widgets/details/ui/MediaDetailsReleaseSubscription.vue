<script setup lang="ts">
import type { MediaTypeEnum, TmdbMediaTypeEnum } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed } from "vue"
import { useGetReleaseSubscriptionByMediaIdApi } from "~/api/releaseSubscription/useReleaseSubscriptionApi"
import { ReleaseSubscruptionButton } from "~/features/releaseSubscriptions"
import { UiTooltip } from "~/shared/ui/UiTooltip"
import { UiTypography } from "~/shared/ui/UiTypography"

interface MediaDetailsReleaseSubscriptionProps {
  mediaId: number
  mediaType: TmdbMediaTypeEnum | MediaTypeEnum
  releaseDate?: string
  title?: string
}

const props = defineProps<MediaDetailsReleaseSubscriptionProps>()
const { t } = useI18n()

const getReleaseSubscriptionApi = useGetReleaseSubscriptionByMediaIdApi({
  mediaId: props.mediaId,
})

const isReleased = computed(() => {
  if (!props.releaseDate)
    return false
  const releaseDate = new Date(props.releaseDate)
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)
  return releaseDate <= currentDate
})

const tooltipContent = computed(() => {
  if (isReleased.value) {
    return t("releaseSubscription.tooltip.movie.alreadyReleased")
  }
  return t(`releaseSubscription.tooltip.${props.mediaType}.subscribe`, { title: props.title || "" })
})
</script>

<template>
  <UiTooltip
    :disabled="!!getReleaseSubscriptionApi.data.value"
    side="bottom"
  >
    <template #trigger>
      <ReleaseSubscruptionButton
        :media-id="props.mediaId"
        :media-type="props.mediaType"
        :subscription="getReleaseSubscriptionApi.data.value || undefined"
        :disabled="isReleased"
      />
    </template>
    <template #content>
      <div :class="$style.wrapper">
        <UiTypography
          :class="$style.title"
          variant="description"
        >
          {{ $t("releaseSubscription.tooltip.title") }}
        </UiTypography>
        <UiTypography
          :class="$style.description"
          variant="badge"
        >
          {{ tooltipContent }}
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

.title {
  color: var(--c-text);
  font-weight: var(--fw-medium);
}

.description {
  color: var(--c-white-60);
}

.icon {
  color: var(--c-description);
}
</style>
