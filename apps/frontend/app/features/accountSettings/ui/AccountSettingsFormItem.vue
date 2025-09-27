<script setup lang="ts">
import { UiButton } from "~/shared/ui/UiButton"
import { UiTypography } from "~/shared/ui/UiTypography"

interface AccountSettingsFormItemProps {
  title: string
  description?: string
  disabled?: boolean
}

const props = defineProps<AccountSettingsFormItemProps>()
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.header">
      <UiTypography
        variant="cardTitle"
        :class="$style.title"
      >
        {{ props.title }}
      </UiTypography>
      <UiTypography
        v-if="props.description"
        :class="$style.description"
      >
        {{ props.description }}
      </UiTypography>
    </div>

    <div :class="$style.content">
      <slot />
      <UiButton
        :disabled="props.disabled"
        type="submit"
      >
        {{ $t("ui.saveChanges") }}
      </UiButton>
    </div>
  </div>
</template>

<style module lang="scss">
.wrapper {
  gap: 20px;
  max-width: 416px;

  &,
  > div {
    display: flex;
    flex-direction: column;
  }
}

.title {
  color: var(--c-description);
}

.description {
  color: var(--c-text);
}

.header {
  gap: 6px;
}

.content {
  gap: 24px;
}
</style>
