<script setup lang="ts">

import { UiTypography } from "~/components/ui/UiTypography"
import { computed, getColorByRating, getFormatedNumber } from "#imports"
import { UiDelimiter } from "~/components/ui/UiDelimiter"
import { minsToTimeConverter } from "@movie-tracker/utils"
import { UiIcon } from "~/components/ui/UiIcon"

interface UiVoteWithRuntimeProps {
  voteAverage: number;
  voteCount: number;
  runtime?: number;
}

const props = defineProps<UiVoteWithRuntimeProps>();

const currentRatingColor = computed(() => {
  return getColorByRating(props.voteAverage);
});

const formatedRuntime = computed(() => {
  if (!props.runtime) return undefined;
  return minsToTimeConverter(props.runtime);
});
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.vote">
      <div
        :class="[$style.rating, {
          [$style.gray]: currentRatingColor === 'gray',
          [$style.red]: currentRatingColor === 'red',
          [$style.orange]: currentRatingColor === 'orange',
          [$style.green]: currentRatingColor === 'green'
        }]"
      >
        <UiIcon name="icon:star" />
        <UiTypography
          variant="labelSmall"
        >
          {{ Number(props.voteAverage.toFixed(1)) }}
        </UiTypography>
      </div>

      <UiTypography
        :class="$style.voteCount"
        variant="badge"
      >
        ({{ getFormatedNumber(props.voteCount, 1) }} {{ $t('details.scores').toLowerCase() }})
      </UiTypography>
    </div>
    <template v-if="props.runtime">
      <UiDelimiter />
    </template>

    <div
      v-if="props.runtime"
      :class="$style.runtimeWrapper"
    >
      <UiIcon name="icon:clocks" />
      <UiTypography
        variant="labelSmall"
        :class="$style.runtime"
      >
        {{ formatedRuntime?.days ? `${formatedRuntime?.days} ${$t("ui.time.shortDay")}` : "" }}
        {{ formatedRuntime?.hours ? `${formatedRuntime?.hours} ${$t("ui.time.shortHour")}` : "" }}
        {{ formatedRuntime?.minutes ? `${formatedRuntime?.minutes} ${$t("ui.time.shortMin")}` : "" }}
      </UiTypography>
    </div>
  </div>
</template>
<style module lang="scss">
.wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.rating,
.vote {
  display: flex;
  gap: 2px;
  align-items: center;

  .voteCount {
    color: var(--c-description);
  }
}

.rating {
  align-items: center;
  height: fit-content;

  &.green {
    color: var(--c-green-2);
  }

  &.orange {
    color: var(--c-orange-2);
  }

  &.red {
    color: var(--c-red);
  }

  &.gray {
    color: var(--c-description);
  }

  p {
    color: inherit;
  }
}

.runtimeWrapper {
  display: flex;
  gap: 2px;
  align-items: center;

  .runtime {
    color: var(--c-description);
  }
}
</style>
