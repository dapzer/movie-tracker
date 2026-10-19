<script setup lang="ts">
import type { UiTabsPaneScheme } from "~/shared/ui/UiTabs/UiTabsPane.vue"

interface UiTabsPaneWrapperProps {
  schema?: UiTabsPaneScheme
}

const props = withDefaults(defineProps<UiTabsPaneWrapperProps>(), {
  schema: "default",
})
</script>

<template>
  <div
    :class="[$style.wrapper, {
      [$style.default]: props.schema === 'default',
      [$style.secondary]: props.schema === 'secondary',
    }]"
  >
    <slot />
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.default {
  padding: 0 16px;
  position: relative;
  gap: 24px;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: var(--c-white-15);
  }
}

.secondary {
}
</style>
