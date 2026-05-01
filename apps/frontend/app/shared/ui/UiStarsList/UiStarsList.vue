<script setup lang="ts">
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"

interface UiStarsListProps {
  size?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<UiStarsListProps>(), {
  size: 24,
})

const selectedRating = defineModel<number | undefined>()
const hoveredRating = defineModel<number | undefined>("hoveredRating")

function handleRatingClick(rating: number, event: MouseEvent) {
  selectedRating.value = rating
  const target = event.currentTarget as HTMLElement
  target.blur()
}
</script>

<template>
  <div
    :class="[$style.list, {
      [$style.disabled]: props.disabled,
    }]"
  >
    <UiButton
      v-for="i in 10"
      :key="i"
      :class="[$style.item, {
        [$style.active]: selectedRating && selectedRating >= i,
      }]"
      variant="textIcon"
      type="button"
      :disabled="props.disabled"
      @click="handleRatingClick(i, $event)"
      @mouseover="hoveredRating = i"
      @mouseleave="hoveredRating = undefined"
    >
      <UiIcon
        :class="$style.icon"
        :size="props.size"
        name="icon:rating-star"
      />
      <UiIcon
        :class="$style.iconFilled"
        :size="props.size"
        name="icon:rating-star-filled"
      />
    </UiButton>
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";

.list {
  display: flex;
  width: fit-content;

  .iconFilled {
    display: none;
  }

  .icon {
    color: var(--c-description);
  }

  .item {
    width: 28px;
    height: 28px;

    &.active {
      .icon {
        display: none;
      }

      .iconFilled {
        display: block;
      }
    }

    &:focus,
    &:hover {
      background-color: transparent;
    }
  }

  &:not(.disabled) {
    @include hoverAvailable {
      &:hover .item,
      &:focus-within .item {
        .icon {
          display: none;
        }

        .iconFilled {
          display: block;
        }
      }

      .item:hover ~ .item,
      .item:focus ~ .item {
        .icon {
          display: block;
        }

        .iconFilled {
          display: none;
        }
      }
    }
  }
}
</style>
