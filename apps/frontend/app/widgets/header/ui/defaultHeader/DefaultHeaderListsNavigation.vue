<script setup lang="ts">
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { ref } from "vue"
import { UiDropdown, UiDropdownGroup, UiDropdownItem, UiDropdownTriggerWithArrow } from "~/shared/ui/UiDropdown"
import { UiTypography } from "~/shared/ui/UiTypography"
import { listsNavigationLinks } from "~/widgets/header/model/listsNavigationLinks"

const localePath = useLocalePath()
const isOpen = ref(false)
</script>

<template>
  <UiDropdown
    v-model="isOpen"
    align="end"
    :indent="32"
  >
    <template #trigger>
      <UiDropdownTriggerWithArrow :is-open="isOpen">
        <UiTypography
          variant="label"
          :class="$style.title"
        >
          {{ $t('navigation.lists') }}
        </UiTypography>
      </UiDropdownTriggerWithArrow>
    </template>

    <template #content>
      <UiDropdownGroup>
        <UiDropdownItem
          v-for="link in listsNavigationLinks"
          :key="link.path"
          :as="NuxtLink"
          :to="localePath(link.path)"
        >
          <template #content>
            {{ $t(link.title) }}
          </template>
        </UiDropdownItem>
      </UiDropdownGroup>
    </template>
  </UiDropdown>
</template>

<style module lang="scss">
.title {
  color: var(--c-white-75);
}
</style>
