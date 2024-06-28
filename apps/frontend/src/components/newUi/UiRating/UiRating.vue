<script setup lang="ts">
import { UiTypography } from "~/components/newUi/UiTypography"
import { computed } from "#imports"

interface UiRatingProps {
  value?: number
}

const props = withDefaults(defineProps<UiRatingProps>(), {
  value: 0
})

const ratingRanges = [
  {
    color: "red",
    min: 0,
    max: 3
  },
  {
    color: "orange",
    min: 3,
    max: 6
  },
  {
    color: "green",
    min: 6,
    max: 10
  },
];

const currentColor = computed(() => {
  for (let range of ratingRanges) {
    if (range.min <= props.value && props.value <= range.max) {
      return range.color;
    }
  }
  return ""
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

  .value {
    font-weight: var(--fw-semi-bold);
    font-size: var(--fs-score);
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
