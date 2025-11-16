<script setup lang="ts">
import { NuxtLink } from "#components"
import { UiButton } from "~/shared/ui/UiButton"

interface UiTabTriggerProps {
  active?: boolean
  href?: string
}

const props = defineProps<UiTabTriggerProps>()
</script>

<template>
  <UiButton
    :as="props.href ? NuxtLink : 'button'"
    variant="default"
    scheme="default"
    :to="props.href ? props.href : undefined"
    :class="[$style.body, {
      [$style.active]: props.active,
    }]"
  >
    <slot />
  </UiButton>
</template>

<style module lang="scss">
@import "~/shared/styles/breakpoints";
@import "~/shared/styles/mixins";

.body {
  font-size: var(--fs-label);
  line-height: var(--lh-label-small);
  font-weight: var(--fw-medium);
  color: var(--c-description);
  border-top-left-radius: var(--s-border-radius-small);
  border-top-right-radius: var(--s-border-radius-small);
  word-break: keep-all;
  width: max-content;
  white-space: nowrap;
  padding: 8px 24px;
  border-bottom: 1px solid transparent;
  display: inline-block;

  @include tabletDevice {
    padding: 8px 18px;
  }

  &:focus:not(.active),
  &:active:not(.active),
  &:hover:not(.active) {
    background-color: var(--c-card-background-hovered);
  }

  &.active {
    color: var(--c-blue);
    background: var(--c-button-background-secondary);
    border-bottom: 1px solid var(--c-blue);
  }
}
</style>
