<script lang="ts" setup>
interface UiContainerProps {
  as?: keyof Pick<HTMLElementTagNameMap, "div" | "section">;
}

const props = withDefaults(defineProps<UiContainerProps>(), {
  as: "div"
});
</script>

<template>
  <component
    :is="props.as"
    :class="$style.body"
  >
    <slot />
  </component>
</template>

<style lang="scss" module>
.body {
  margin: 0 auto;
  width: 100%;
  max-width: var(--s-container);
  padding: 0 var(--s-indent);
}
</style>
