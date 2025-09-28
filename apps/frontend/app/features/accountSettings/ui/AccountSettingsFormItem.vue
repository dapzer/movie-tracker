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
        variant="description"
        :class="$style.description"
      >
        {{ props.description }}
      </UiTypography>
    </div>

    <div :class="$style.content">
      <slot />
      <UiButton
        :class="$style.submitButton"
        :disabled="props.disabled"
        type="submit"
      >
        {{ $t("ui.change") }}
      </UiButton>
    </div>
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/variables.scss";
@import "~/shared/styles/mixins.scss";

.wrapper {
  gap: 20px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;

  @include mobileDevice() {
    align-items: flex-start;
    flex-direction: column;
  }
}

.title {
  color: var(--c-text);
}

.header {
  flex-shrink: 0;
}

.description {
  margin-top: 8px;
}

.content {
  max-width: 384px;
  gap: 8px;
  flex: 1 1 auto;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;

  @include mobileDevice() {
    max-width: unset;
    width: 100%;
    flex-direction: column;
  }
}

.submitButton {
  white-space: nowrap;

  @include mobileDevice() {
    width: 100%;
  }
}
</style>
