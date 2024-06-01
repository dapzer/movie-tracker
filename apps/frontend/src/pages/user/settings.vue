<script lang="ts" setup>

import UiContainer from '~/components/ui/UiContainer.vue';
import { UserProfileSettingsForm } from '~/features/profile';
import { useAuth, useI18n, useSeoMeta, watch } from '#imports';
import { AccountSettingsForm } from '~/features/account';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const { isNotAuthorized, isLoadingProfile } = useAuth();
const router = useRouter();

watch([isNotAuthorized, isLoadingProfile], () => {
  if (isNotAuthorized.value && !isLoadingProfile.value) {
    router.push('/');
  }
});

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
  <UiContainer :class="$style.container">
    <UserProfileSettingsForm :class="$style.wrapper" />
    <AccountSettingsForm :class="$style.wrapper" />
  </UiContainer>
</template>

<style lang="scss" module>
.container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.wrapper {
  margin: 0 auto;
  max-width: 460px;
  width: 100%;
}
</style>
