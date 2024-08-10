<script setup lang="ts">
import { UiTypography } from "~/components/newUi/UiTypography"
import { computed } from "#imports"
import { getColorByRating } from "~/utils/getColorByRating"

interface UiRatingProps {
  value?: number
}

const props = withDefaults(defineProps<UiRatingProps>(), {
  value: 0
})

const currentColor = computed(() => {
  return getColorByRating(props.value);
});
</script>

<template>
  <div
    :class="[$style.wrapper, {
      [$style.red]: currentColor === 'red',
      [$style.orange]: currentColor === 'orange',
      [$style.green]: currentColor === 'green'
    }]"
  >
    <UiTypography
      :class="$style.value"
      variant="text"
    >
      {{ Number(props.value.toFixed(1)) }}
    </UiTypography>
  </div>
</template>

<style module lang="scss">
.wrapper {
  padding: 2px 6px;
  border-radius: var(--s-border-radius-small);
  width: fit-content;
  display: flex;
  height: 20px;
  align-items: center;
  justify-content: center;

  .value {
    font-weight: var(--fw-semi-bold);
    font-size: var(--fs-score);
    height: var(--fs-score);
    line-height: var(--lh-score);
    color: var(--c-text);
  }

  &.green {
    background: var(--c-green-2);
  }

  &.orange {
    background: var(--c-orange-2);
  }

  &.red {
    background: var(--c-red);
  }
}
</style>
