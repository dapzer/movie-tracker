<script lang="ts" setup>

type Variant = "underlined";

const props = defineProps<{
  variant?: Variant
}>();

const inputModel = defineModel()
</script>

<template>
  <input
    v-model="inputModel"
    :class="[$style.body, {
      [$style.underlined]: props.variant === 'underlined',
    }]"
  >
</template>

<style lang="scss" module>
.body {
  background: none;
  text-decoration: none;
  outline: none;
  border: 1px solid var(--c-text);
  padding: 10px 16px;
  color: var(--c-secondary);
  font-size: var(--fs-p);
  border-radius: var(--s-border-radius);
  width: 100%;
}

.underlined {
  font-size: var(--fs-span);
  border-radius: unset;
  border: none;
  border-bottom: 1px solid var(--c-text);
}
</style>
