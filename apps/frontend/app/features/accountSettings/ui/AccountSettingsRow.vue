<script setup lang="ts">
import { UiTypography } from "~/shared/ui/UiTypography"

interface AccountSettingsRowProps {
  title: string
  description?: string
  contentClass?: string
}

const props = defineProps<AccountSettingsRowProps>()
</script>

<template>
  <div :class="$style.wrapper">
    <div>
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

    <div :class="[$style.content, props.contentClass]">
      <slot />
    </div>
  </div>
</template>

<style module lang="scss">
@use "~/shared/styles/variables" as *;
@use "~/shared/styles/mixins" as *;

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

.description {
  margin-top: 8px;
  white-space: break-spaces;
}

.content {
  max-width: 384px;
  width: 100%;

  @include mobileDevice() {
    max-width: unset;
  }
}
</style>
