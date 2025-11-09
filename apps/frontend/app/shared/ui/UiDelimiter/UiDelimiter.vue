<script setup lang="ts">
export type UiDelimiterSchema = "white" | "stroke"

interface UiDelimiterProps {
  schema?: UiDelimiterSchema
}

const props = withDefaults(defineProps<UiDelimiterProps>(), {
  schema: "stroke",
})
</script>

<template>
  <span
    :class="[$style.body, {
      [$style.white]: props.schema === 'white',
    }]"
  >
    &zwnj;
  </span>
</template>

<style module lang="scss">
.body {
  width: 5px;
  height: 100%;
  position: relative;
  line-height: inherit;

  &::before {
    content: "";
    position: absolute;
    top: calc(50% - 2.5px);
    width: 5px;
    height: 5px;
    border-radius: 100%;
    background-color: var(--c-stroke);
  }

  &.white::before {
    background-color: var(--c-white-50);
  }
}
</style>
