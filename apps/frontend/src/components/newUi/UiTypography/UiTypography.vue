<script lang="ts" setup>
import type { ComponentOrTag } from "~/types/ComponentOrTag"

export type UiTypographySchema = 'link'
export type UiTypographyVariant = 'text'
    | 'title'
    | 'title2'
    | 'title3'
    | 'title4'
    | 'subheading'
    | 'label'
    | 'labelSmall'
    | 'listTitle'
    | 'cardTitle'
    | 'description'
    | 'badge'

export interface UiTypographyProps {
  as?: ComponentOrTag;
  variant?: UiTypographyVariant;
  schema?: UiTypographySchema;
}

const props = withDefaults(defineProps<UiTypographyProps>(), {
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
      [$style.labelSmall]: variant === 'labelSmall',
      [$style.listTitle]: variant === 'listTitle',
      [$style.cardTitle]: variant === 'cardTitle',
      [$style.description]: variant === 'description',
      [$style.badge]: variant === 'badge',
      [$style.badge]: variant === 'badge',
      [$style.link]: schema === 'link',
    }"
  >
    <slot />
  </component>
</template>

<style lang="scss" module>
.title {
  color: var(--c-text);
  font-size: var(--fs-h1);
  line-height: var(--lh-h1);
  font-weight: var(--fw-bold);
}

.title2 {
  color: var(--c-text);
  font-size: var(--fs-h2);
  font-weight: var(--fw-bold);
  line-height: var(--lh-h2);
}

.title3 {
  color: var(--c-text);
  font-size: var(--fs-h3);
  line-height: var(--lh-h3);
  font-weight: var(--fw-medium);
}

.title4 {
  color: var(--c-text);
  font-size: var(--fs-h4);
  line-height: var(--lh-h4);
  font-weight: var(--fw-medium);
}

.subheading {
  color: var(--c-text);
  font-size: var(--fs-subheading);
  line-height: var(--lh-subheading);
  font-weight: var(--fw-medium);
}

.text {
  color: var(--c-text-secondary);
  font-size: var(--fs-p);
  line-height: var(--lh-p);
  font-weight: var(--fw-medium);
}

.label {
  color: var(--c-text);
  font-size: var(--fs-label);
  line-height: var(--lh-label);
  font-weight: var(--fw-medium);
  font-family: var(--ff-inter);
}

.labelSmall {
  color: var(--c-text);
  font-size: var(--fs-label-small);
  line-height: var(--lh-label-small);
  font-weight: var(--fw-medium);
  font-family: var(--ff-inter);
}

.listTitle {
  color: var(--c-text);
  font-size: var(--fs-list-title);
  line-height: var(--lh-list-title);
  font-weight: var(--fw-medium);
}

.cardTitle {
  color: var(--c-text);
  font-size: var(--fs-card-title);
  line-height: var(--lh-card-title);
  font-weight: var(--fw-medium);
}

.description {
  color: var(--c-description);
  font-size: var(--fs-description);
  line-height: var(--lh-description);
  font-weight: var(--fw-regular);
  font-family: var(--ff-inter);
}

.badge {
  color: var(--c-text);
  font-size: var(--fs-badge);
  line-height: var(--lh-badge);
  font-weight: var(--fw-regular);
  font-family: var(--ff-inter);
}

.link {
  color: var(--c-label-link);
  cursor: pointer;

  &:active,
  &:focus,
  &:hover {
    color: var(--c-label-lihk-hovered);
  }
}
</style>
