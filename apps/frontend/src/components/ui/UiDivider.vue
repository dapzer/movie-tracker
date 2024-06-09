<script setup lang="ts">
interface UiDividerProps {
  height?: number
}

const props = withDefaults(defineProps<UiDividerProps>(), {
  height: 1
})

const slot = defineSlots()
</script>

<template>
  <div
    :class="{
      [$style.withText]: slot.default,
      [$style.body]: !slot.default
    }"
    :style="{ '--height': `${props.height}px` }"
  >
    <slot />
  </div>
</template>

<style module lang="scss">
.body {
  border: none;
  width: 100%;
  height: var(--height);
  background: var(--c-text);
  opacity: var(--s-disabled-opacity);
  border-radius: var(--s-border-radius);
}

.withText {
  display: flex;
  flex-direction: row;

  & > * {
    line-height: 1;
  }

  &::after, &::before {
    content: "";
    flex: 1 1;
    border-bottom: var(--height) solid var(--c-text);
    margin: auto;
  }

  &::before {
    margin-right: 8px;
  }

  &::after {
    margin-left: 8px;
  }
}
</style>
