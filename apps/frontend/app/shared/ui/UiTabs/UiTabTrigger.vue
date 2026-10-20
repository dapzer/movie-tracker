<script setup lang="ts">
import { NuxtLink } from "#components"
import { UiButton } from "~/shared/ui/UiButton"
import { UiTypography } from "~/shared/ui/UiTypography"

export type UiTabsTriggerScheme = "default" | "secondary"

interface UiTabTriggerProps {
  active?: boolean
  href?: string
  description?: string | number
  scheme?: UiTabsTriggerScheme
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
      [$style.default]: props.scheme === 'default',
      [$style.secondary]: props.scheme === 'secondary',
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
@use "~/shared/styles/breakpoints" as *;
@use "~/shared/styles/mixins" as *;

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
}

.default {
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

.secondary {
  width: 100%;
  justify-content: center;

  &:focus:not(.active),
  &:active:not(.active),
  &:hover:not(.active) {
    color: var(--c-blue-85);
  }

  &.active {
    color: var(--c-blue);
    background-color: var(--c-button-background-secondary);
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
