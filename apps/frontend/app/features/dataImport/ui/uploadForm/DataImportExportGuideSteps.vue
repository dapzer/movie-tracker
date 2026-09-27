<script setup lang="ts">
import type { DataImportSourceEnum } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { DataImportSourceEnum as SourceEnum } from "@movie-tracker/types"
import { computed } from "vue"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiTag } from "~/shared/ui/UiTag"
import { UiTypography } from "~/shared/ui/UiTypography"

interface DataImportExportGuideStepsProps {
  source: DataImportSourceEnum
}

const props = defineProps<DataImportExportGuideStepsProps>()

const { tm, rt } = useI18n()

const steps = computed(() => {
  return (tm(`dataImport.guide.steps.${props.source}`) as string[]).map(step => rt(step))
})

const exportPageUrl = computed(() => {
  switch (props.source) {
    case SourceEnum.LETTERBOXD:
      return "https://letterboxd.com/settings/data/"
    case SourceEnum.TRAKT:
      return "https://app.trakt.tv/settings/data"
    default:
      return ""
  }
})
</script>

<template>
  <div :class="$style.wrapper">
    <ul :class="$style.steps">
      <li
        v-for="(step, index) in steps"
        :key="index"
      >
        <UiTag
          text-variant="label"
          :class="$style.stepNumber"
          color="blue-light"
          variant="boxed"
        >
          {{ index + 1 }}
        </UiTag>
        <UiTypography :class="$style.stepDescription">
          {{ step }}
        </UiTypography>
      </li>
    </ul>

    <UiTypography
      :class="$style.link"
      as="a"
      :href="exportPageUrl"
      target="_blank"
      rel="noopener noreferrer"
      variant="label"
    >
      {{ $t("dataImport.guide.openExportPage") }}
      <UiIcon name="icon:round-open-in-new-tab" />
    </UiTypography>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px;
  border-radius: var(--s-border-radius-medium);
  background-color: var(--c-white-04);
}

.steps {
  li {
    display: flex;
    align-items: center;
    gap: 12px;

    .stepNumber {
      width: 24px;
    }

    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }

  .stepDescription {
    color: var(--c-text);
  }

  li::marker {
    color: var(--c-description);
  }
}

.link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--c-label-link);
  text-decoration: none;
  width: fit-content;

  &:hover {
    color: var(--c-label-link-hovered);
  }
}
</style>
