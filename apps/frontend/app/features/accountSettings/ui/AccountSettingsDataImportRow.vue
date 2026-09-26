<script setup lang="ts">
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import AccountSettingsRow from "~/features/accountSettings/ui/AccountSettingsRow.vue"
import { UiButton } from "~/shared/ui/UiButton"

const localePath = useLocalePath()
</script>

<template>
  <AccountSettingsRow
    :title="$t('accountSettings.dataImport.title')"
    :description="$t('accountSettings.dataImport.description')"
    :content-class="$style.content"
  >
    <UiButton
      :class="$style.action"
      :as="NuxtLink"
      :to="localePath('/settings/data-import')"
    >
      {{ $t('accountSettings.dataImport.link') }}
    </UiButton>
  </AccountSettingsRow>
</template>

<style module lang="scss">
@use "~/shared/styles/variables" as *;
@use "~/shared/styles/mixins" as *;

.action {
  text-align: center;

  @include mobileDevice() {
    width: 100%;
  }
}

.content {
  display: flex;
  justify-content: flex-end;

  @include mobileDevice() {
    justify-content: flex-start;
  }
}
</style>
