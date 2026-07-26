<script setup lang="ts">
import { UiBackLink } from "~/shared/ui/UiBackLink"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiTypography } from "~/shared/ui/UiTypography"

interface ContentListHeaderProps {
  title: string
  backButtonText?: string
  backButtonUrl: string
}

const props = defineProps<ContentListHeaderProps>()
</script>

<template>
  <div :class="$style.header">
    <UiBackLink
      :url="props.backButtonUrl"
      :text="props.backButtonText"
    />
    <UiTypography
      as="h1"
      variant="title"
    >
      {{ props.title }}
    </UiTypography>
  </div>
  <UiDivider :class="$style.divider" />
</template>

<style module lang="scss">
.header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.divider {
  margin-top: 20px;
  margin-bottom: 16px;
}
</style>
