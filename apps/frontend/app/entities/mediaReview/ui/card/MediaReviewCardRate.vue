<script setup lang="ts">
import type { MediaReview } from "@movie-tracker/types"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiTypography } from "~/shared/ui/UiTypography"

interface MediaReviewCardRateProps {
  rating?: MediaReview["rating"]
}

const props = defineProps<MediaReviewCardRateProps>()
</script>

<template>
  <div :class="$style.wrapper">
    <template v-if="props.rating">
      <UiIcon
        :class="$style.star"
        name="icon:rating-star-filled"
        :size="16"
        block
      />
      <UiTypography variant="label">
        {{ props.rating }}<span>/10</span>
      </UiTypography>
    </template>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  align-items: center;
  gap: 2px;

  p span {
    color: var(--c-description);
  }
}
</style>
