<script lang="ts" setup>
import { computed } from "#imports";
import UiTypography from "~/components/ui/UiTypography.vue";

const scoreRanges = [
  {
    color: "#ff4545",
    min: 0,
    max: 3
  },
  {
    color: "#ffa534",
    min: 3,
    max: 6
  },
  {
    color: "#b7dd29",
    min: 6,
    max: 9
  },
  {
    color: "#57e32c",
    min: 9,
    max: 10
  }
];

interface UiScoreCircleProps {
  value: number;
}

const props = defineProps<UiScoreCircleProps>();

const indicatorColor = computed(() => {
  for (let range of scoreRanges) {
    if (range.min <= props.value && props.value <= range.max) {
      return range.color;
    }
  }
  return "#000";
});
</script>

<template>
  <div :class="$style.wrapper">
    <div
      :class="$style.indicator"
      :style="{
        '--progress': `${3.6 * (value * 10)}deg`,
        '--progressColor': indicatorColor
      }"
    >
      <UiTypography
        variant="textSmall"
        as="span"
        :class="$style.score"
      >
        {{ Number(value.toFixed(1)) }}
      </UiTypography>
    </div>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  padding: 5px;
  background: var(--c-accent);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
}

.indicator {
  position: relative;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background: conic-gradient(var(--progressColor) var(--progress), var(--c-background) 0deg, var(--c-background) 360deg);
  display: flex;
  align-items: center;
  justify-content: center;

  &:before {
    content: "";
    position: absolute;
    height: 35px;
    width: 35px;
    border-radius: 50%;
    background-color: var(--c-accent);
  }

  span {
    position: relative;
    font-size: var(--fs-span);
    font-weight: var(--fw-bold);
    line-height: 0;
    color: var(--c-secondary);
  }
}

</style>
