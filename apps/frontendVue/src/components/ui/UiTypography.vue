<script lang="ts" setup>
import type { Component, VNode } from "vue";

interface Props {
  as?: Component | VNode | keyof HTMLElementTagNameMap;
  variant?:
    | "text"
    | "title"
    | "title2"
    | "title3"
    | "link"
    | "linkUnderlined"
    | "textSmall"
    | "listItem";
}

const props = withDefaults(defineProps<Props>(), {
  as: "p",
  variant: "text"
});
</script>

<template>
  <component
    :is="props.as"
    :class="{
      [$style.text]: variant === 'text',
      [$style.title]: variant === 'title',
      [$style.title2]: variant === 'title2',
      [$style.title3]: variant === 'title3',
      [$style.textSmall]: variant === 'textSmall',
      [$style.link]: variant === 'link',
      [$style.linkUnderlined]: variant === 'linkUnderlined',
      [$style.listItem]: variant === 'listItem',
    }"
  >
    <slot />
  </component>
</template>

<style lang="scss" module>
.title {
  color: var(--c-secondary);
  font-size: var(--fs-h1);
  font-weight: var(--fw-bold);
}

.title2 {
  color: var(--c-secondary);
  font-size: var(--fs-h2);
  font-weight: var(--fw-bold);

  @media screen and (max-width: var(--bp-sm)) {
    font-size: var(--fs-m-h2);
  }
}

.title3 {
  color: var(--c-secondary);
  font-size: var(--fs-h3);
  font-weight: var(--fw-medium);
}

.text {
  color: var(--c-text);
  font-size: var(--fs-p);
  font-weight: var(--fw-medium);
}

.textSmall {
  color: var(--c-text);
  font-size: var(--fs-span);
  font-weight: var(--fw-light);
}

.linkUnderlined,
.link {
  color: var(--c-secondary);
  font-size: var(--fs-p);
  font-weight: var(--fw-regular);
  cursor: pointer;
  text-decoration: none;
  height: fit-content;
  line-height: 1;

  &:hover {
    color: var(--c-highlight);
    border-color: var(--c-highlight) !important;
  }
}
.linkUnderlined {
  border-bottom: 1px solid var(--c-secondary);
}

.listItem {
  color: var(--c-secondary);
  font-size: var(--fs-p);
  font-weight: var(--fw-regular);
}
</style>
