<script lang="ts" setup>

import { allowedLanguages } from "~/features/languegeSelector/model/languages";
import { UiTypography } from "../../../shared/ui/UiTypography";
import { useSwitchLocalePath } from "#i18n";
import { useI18n } from "#imports";
import { UiDropdown, UiDropdownGroup, UiDropdownItem, UiDropdownTriggerWithArrow } from "../../../shared/ui/UiDropdown"
import { NuxtLink } from "#components"
import { ref } from "vue"
import { UiIcon } from "../../../shared/ui/UiIcon"

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
        <UiIcon
          name="icon:planet"
          :size="20"
        />
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
