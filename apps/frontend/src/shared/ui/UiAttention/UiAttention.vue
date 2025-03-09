<script setup lang="ts">
import type { UiTypographyVariant } from "~/shared/ui/UiTypography"
import { UiTypography } from "~/shared/ui/UiTypography"

interface UiAttentionProps {
  title: string
  description?: string
  indent?: number
  titleVariant?: UiTypographyVariant
}

const props = withDefaults(defineProps<UiAttentionProps>(), {
  indent: 70,
  titleVariant: "title4",
})
</script>

<template>
  <div
    :class="$style.wrapper"
    :style="{ '--indent': `${props.indent}px` }"
  >
    <UiTypography :variant="props.titleVariant">
      {{ props.title }}
    </UiTypography>
    <UiTypography v-if="props.description">
      {{ props.description }}
    </UiTypography>
    <slot />
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  max-width: 454px;
  margin: var(--indent) auto 0;

  p {
    text-align: center;
    color: var(--c-description);
  }
}
</style>
