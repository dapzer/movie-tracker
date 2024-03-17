<script lang="ts" setup>

interface UiLabelProps {
  title: string;
  inline?: boolean
}

const props = defineProps<UiLabelProps>();

</script>

<template>
  <label :class="[$style.body, { [$style.inline]: props.inline }]">
    {{ props.title }}
    <slot />
  </label>
</template>

<style lang="scss" module>
.body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: var(--fs-h3);
  color: var(--c-secondary);

  input {
    border-radius: unset;
    padding: 6px 12px;
  }
}
</style>
