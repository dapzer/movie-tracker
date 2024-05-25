<script setup lang="ts">

import UiContainer from '~/components/ui/UiContainer.vue';
import UserProfileSettingsForm from '~/features/profile/ui/UserProfileSettingsForm.vue';
import { useI18n, useSeoMeta } from '#imports';

const { t } = useI18n();

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${titleChunk} | ${t('navigation.accountSettings')}`;
  },
  ogTitle() {
    return `%s | ${t('navigation.accountSettings')}`;
  },
});
</script>

<template>
  <UiContainer>
    <UserProfileSettingsForm :class="$style.wrapper" />
  </UiContainer>
</template>

<style module lang="scss">
.wrapper {
  margin: 0 auto;
  max-width: 460px;
  width: 100%;
}
</style>
