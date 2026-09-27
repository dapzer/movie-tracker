<script setup lang="ts">
import DataImportCard from "~/features/dataImport/ui/DataImportCard.vue"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiSwitch } from "~/shared/ui/UiSwitch"
import { UiTypography } from "~/shared/ui/UiTypography"

interface DataImportProcessingToggleCardProps {
  title: string
  foundCount: number
  failedCount?: number
  disabled?: boolean
}

const props = defineProps<DataImportProcessingToggleCardProps>()

const slots = defineSlots()

const enabled = defineModel<boolean>("enabled", { default: false })
</script>

<template>
  <DataImportCard :class="$style.wrapper">
    <div :class="$style.header">
      <div :class="$style.toggle">
        <UiSwitch
          v-model="enabled"
          :disabled="props.disabled || props.foundCount === 0"
        />
        <UiTypography
          :class="$style.title"
          variant="label"
        >
          {{ props.title }}
        </UiTypography>
      </div>

      <div :class="$style.counts">
        <UiTypography variant="cardTitle">
          {{ $t("dataImport.processing.found", { count: props.foundCount }) }}
        </UiTypography>
        <UiTypography
          v-if="props.failedCount"
          :class="$style.failed"
          variant="description"
        >
          <UiIcon
            name="icon:error"
            :size="14"
          />
          {{ $t("dataImport.processing.notFound", { count: props.failedCount }) }}
        </UiTypography>
      </div>
    </div>

    <template v-if="enabled && slots.default">
      <UiDivider />

      <slot />
    </template>
  </DataImportCard>
</template>

<style module lang="scss">
@use "~/shared/styles/mixins" as *;

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;

  label {
    height: 24px;
  }
}

.title {
  @include ellipsisText;
}

.counts {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;

  p {
    white-space: nowrap;
  }
}

.failed {
  color: var(--c-error-3);
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
