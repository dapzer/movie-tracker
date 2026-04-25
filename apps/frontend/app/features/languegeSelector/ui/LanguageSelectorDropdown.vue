<script lang="ts" setup>
import { NuxtLink } from "#components"
import { useSwitchLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { LanguagesEnum } from "@movie-tracker/types"
import { ref, watch } from "vue"
import { allowedLanguages } from "~/features/languegeSelector/model/languages"
import { useLanguage } from "~/shared/composables/useLanguage"
import { UiDropdown, UiDropdownGroup, UiDropdownItem, UiDropdownTriggerWithArrow } from "~/shared/ui/UiDropdown"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiTypography } from "~/shared/ui/UiTypography"

const switchLocalePath = useSwitchLocalePath()
const { locale } = useI18n()
const { setLanguage } = useLanguage()

const isOpen = ref(false)

watch(locale, (newLocale) => {
  const languageEnum = newLocale === "ru" ? LanguagesEnum.RU : LanguagesEnum.EN

  setLanguage(languageEnum)
})
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
