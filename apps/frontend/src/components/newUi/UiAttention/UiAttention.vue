<script setup lang="ts">
import { UiTypography } from "~/components/newUi/UiTypography"

interface UiAttentionProps {
  title: string;
  description?: string;
  indent?: number;
}

const props = withDefaults(defineProps<UiAttentionProps>(), {
  indent: 70
});
</script>

<template>
  <div
    :class="$style.wrapper"
    :style="{ '--indent': `${props.indent}px` }"
  >
    <UiTypography variant="title4">
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
