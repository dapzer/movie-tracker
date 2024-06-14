<script lang="ts" setup>
import type { Component, VNode } from 'vue';

export type TypographyVariant = 'text'
  | 'title'
  | 'title2'
  | 'title3'
  | 'title4'
  | 'subheading'
  | 'label'
  | 'listTitle'
  | 'cardTitle'
  | 'description'
  | 'badge'

interface TypographyProps {
  as?: Component | VNode | keyof HTMLElementTagNameMap;
  variant?: TypographyVariant;
}

const props = withDefaults(defineProps<TypographyProps>(), {
  as: 'p',
  variant: 'text',
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
      [$style.title4]: variant === 'title4',
      [$style.subheading]: variant === 'subheading',
      [$style.label]: variant === 'label',
      [$style.listTitle]: variant === 'listTitle',
      [$style.cardTitle]: variant === 'cardTitle',
      [$style.description]: variant === 'description',
      [$style.badge]: variant === 'badge',
    }"
  >
    <slot />
  </component>
</template>

<style lang="scss" module>
.title {
  // TODO: Change color
  color: var(--c-text);
  font-size: var(--fs-h1);
  line-height: var(--lh-h1);
  font-weight: var(--fw-bold);
}

.title2 {
  // TODO: Change color
  color: var(--c-text);
  font-size: var(--fs-h2);
  font-weight: var(--fw-bold);
  line-height: var(--lh-h2);
}

.title3 {
  // TODO: Change color
  color: var(--c-text);
  font-size: var(--fs-h3);
  line-height: var(--lh-h3);
  font-weight: var(--fw-medium);
}

.title4 {
  // TODO: Change color
  color: var(--c-text);
  font-size: var(--fs-h4);
  line-height: var(--lh-h4);
  font-weight: var(--fw-medium);
}

.subheading {
  // TODO: Change color
  color: var(--c-text);
  font-size: var(--fs-subheading);
  line-height: var(--lh-subheading);
  font-weight: var(--fw-medium);
  font-family: var(--ff-inter);
}

.text {
  //color: var(--c-text);
  font-size: var(--fs-p);
  line-height: var(--lh-p);
  font-weight: var(--fw-medium);
  font-family: var(--ff-inter);
}

.label {
  // TODO: Change color
  color: var(--c-text);
  font-size: var(--fs-label);
  line-height: var(--lh-label);
  font-weight: var(--fw-medium);
}

.listTitle {
  // TODO: Change color
  color: var(--c-text);
  font-size: var(--fs-list-title);
  line-height: var(--lh-list-title);
  font-weight: var(--fw-medium);
  font-family: var(--ff-inter);
}

.cardTitle {
  // TODO: Change color
  color: var(--c-text);
  font-size: var(--fs-card-title);
  line-height: var(--lh-card-title);
  font-weight: var(--fw-medium);
  font-family: var(--ff-inter);
}

.description {
  // TODO: Change color
  color: var(--c-description);
  font-size: var(--fs-description);
  line-height: var(--lh-description);
  font-weight: var(--fw-regular);
  font-family: var(--ff-inter);
}

.badge {
  // TODO: Change color
  color: var(--c-text);
  font-size: var(--fs-badge);
  line-height: var(--lh-badge);
  font-weight: var(--fw-regular);
  font-family: var(--ff-inter);
}

//.linkUnderlined,
//.link {
//  color: var(--c-text);
//  font-size: var(--fs-p);
//  font-weight: var(--fw-regular);
//  cursor: pointer;
//  text-decoration: none;
//  height: fit-content;
//  line-height: 1;
//
//  &:hover {
//    color: var(--c-highlight);
//    border-color: var(--c-highlight) !important;
//  }
//}
</style>
