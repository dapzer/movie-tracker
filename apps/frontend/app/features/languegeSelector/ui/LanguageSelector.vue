<script setup lang="ts">
import { NuxtLink } from "#components"
import { useSwitchLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { allowedLanguages } from "~/features/languegeSelector/model/languages"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiTypography } from "~/shared/ui/UiTypography"

const switchLocalePath = useSwitchLocalePath()
const { locale } = useI18n()
</script>

<template>
  <div :class="$style.wrapper">
    <template
      v-for="(language, index) in allowedLanguages"
      :key="language"
    >
      <UiTypography
        :class="{ [$style.active]: language.value === locale }"
        :as="NuxtLink"
        :to="switchLocalePath(language.value)"
      >
        {{ language.originalName }}
      </UiTypography>
      <UiDivider
        v-if="index !== allowedLanguages.length - 1"
        vertical
        :height="20"
        :width="1"
      />
    </template>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  gap: 12px;
  align-items: center;

  a {
    color: var(--c-white-50);
  }

  .active {
    color: var(--c-text);
  }
}
</style>
