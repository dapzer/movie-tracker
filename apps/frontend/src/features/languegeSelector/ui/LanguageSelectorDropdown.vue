<script lang="ts" setup>

import { allowedLanguages } from "~/features/languegeSelector/model/languages";
import { UiTypography } from "~/components/ui/UiTypography";
import { useSwitchLocalePath } from "#i18n";
import { useI18n } from "#imports";
import { UiDropdown, UiDropdownGroup, UiDropdownItem, UiDropdownTriggerWithArrow } from "~/components/ui/UiDropdown"
import { NuxtLink } from "#components"
import { PlanetIcon } from "~/components/ui/icons";
import { ref } from "vue"

const switchLocalePath = useSwitchLocalePath();
const { locale } = useI18n();

const isOpen = ref(false);
</script>

<template>
  <UiDropdown
    v-model="isOpen"
    align="end"
    :indent="32"
  >
    <template #trigger>
      <UiDropdownTriggerWithArrow
        :is-open="isOpen"
      >
        <PlanetIcon />
        <UiTypography variant="label">
          {{ locale.toUpperCase() }}
        </UiTypography>
      </UiDropdownTriggerWithArrow>
    </template>

    <template #content>
      <UiDropdownGroup>
        <UiDropdownItem
          v-for="(language) in allowedLanguages"
          :key="language.value"
          :as="NuxtLink"
          :to="switchLocalePath(language.value)"
        >
          <template #content>
            {{ language.value.toUpperCase() }}
          </template>
        </UiDropdownItem>
      </UiDropdownGroup>
    </template>
  </UiDropdown>
</template>

<style module lang="scss">
</style>
