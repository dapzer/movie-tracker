<script setup lang="ts">
import { NuxtLink } from "#components"
import { UiButton } from "~/shared/ui/UiButton"
import { UiTypography } from "~/shared/ui/UiTypography"

interface UiTabTriggerProps {
  active?: boolean
  href?: string
  description?: string | number
}

const props = defineProps<UiTabTriggerProps>()
</script>

<template>
  <UiButton
    :as="props.href ? NuxtLink : 'button'"
    variant="text"
    scheme="default"
    :to="props.href ? props.href : undefined"
    :class="[$style.body, {
      [$style.active]: props.active,
    }]"
  >
    <slot />

    <div
      v-if="props.description"
      :class="$style.description"
    >
      <UiTypography
        as="span"
        variant="badge"
      >
        {{ props.description }}
      </UiTypography>
    </div>
  </UiButton>
</template>

<style module lang="scss">
@import "~/shared/styles/breakpoints";
@import "~/shared/styles/mixins";

.body {
  font-size: var(--fs-label);
  line-height: var(--lh-label-small);
  font-weight: var(--fw-medium);
  color: var(--c-white-75);
  word-break: keep-all;
  width: max-content;
  white-space: nowrap;
  padding: 12px 4px;
  border-bottom: 1px solid transparent;
  display: inline-flex;
  gap: 6px;

  &:focus:not(.active),
  &:active:not(.active),
  &:hover:not(.active) {
    color: var(--c-blue-85);
  }

  &.active {
    color: var(--c-blue);
    border-bottom: 2px solid var(--c-blue);
  }
}

.description {
  display: flex;
  align-items: center;
  width: fit-content;
  background-color: var(--c-white-10);
  padding: 2px 6px;
  border-radius: 99px;

  span {
    color: var(--c-white-60);
  }
}
</style>
