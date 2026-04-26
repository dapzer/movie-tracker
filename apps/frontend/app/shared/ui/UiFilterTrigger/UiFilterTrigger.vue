<script setup lang="ts">
import type { UiButtonScheme, UiButtonVariant } from "~/shared/ui/UiButton"
import { computed } from "vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"

interface UiFilterTriggerProps {
  active?: boolean
}

const props = defineProps<UiFilterTriggerProps>()
const emits = defineEmits<{
  (event: "clear"): void
}>()

const variant = computed<UiButtonVariant>(() => props.active ? "boxed" : "outlined")
const scheme = computed<UiButtonScheme>(() => props.active ? "secondary-light" : "primary")
</script>

<template>
  <UiButton
    :class="$style.body"
    :variant="variant"
    :scheme="scheme"
  >
    <slot />
    <UiButton
      v-if="props.active"
      :class="$style.clearButton"
      variant="textIcon"
      @click.stop="emits('clear')"
    >
      <UiIcon
        name="icon:close"
        :size="8.75"
      />
    </UiButton>
  </UiButton>
</template>

<style module lang="scss">
.body {
  border-radius: var(--s-border-radius-super-mega-huge);
  font-size: var(--fs-label-small);
  display: flex;
  align-items: center;
  gap: 6px;
}

.clearButton {
  width: 16px;
  height: 16px;
  color: inherit;
}
</style>
