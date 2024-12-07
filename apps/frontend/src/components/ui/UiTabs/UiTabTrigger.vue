<script setup lang="ts">
import { UiButton } from "~/components/ui/UiButton"

interface UiTabTriggerProps {
  active?: boolean;
}

const props = defineProps<UiTabTriggerProps>();
</script>

<template>
  <UiButton
    variant="default"
    scheme="default"
    :class="[$style.body, {
      [$style.active]: props.active
    }]"
  >
    <slot />
  </UiButton>
</template>

<style module lang="scss">
@import "~/styles/variables";
@import "~/styles/mixins";

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

  @include tabletDevice {
    padding: 8px 18px;
  }

  &:focus:not(.active),
  &:active:not(.active),
  &:hover:not(.active) {
    border-radius: var(--s-border-radius-small);
    background-color: var(--c-card-background-hovered);
  }

  &.active {
    color: var(--c-blue);
    background: var(--c-button-background-secondary);
    border-bottom: 1px solid var(--c-blue);
  }

}
</style>
