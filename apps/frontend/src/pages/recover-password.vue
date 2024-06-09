<script lang="ts" setup>

import UiContainer from '~/components/ui/UiContainer.vue';
import { RecoverPasswordForm } from '~/features/auth';
import { useI18n, useSeoMeta } from '#imports';

const { t } = useI18n();

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${titleChunk} | ${t('auth.passwordRecovery')}`;
  },
  ogTitle() {
    return `%s | ${t('auth.passwordRecovery')}`;
  },
});
</script>

<template>
  <UiContainer>
    <RecoverPasswordForm :class="$style.wrapper" />
  </UiContainer>
</template>

<style lang="scss" module>
.wrapper {
  margin: 0 auto;
  max-width: 460px;
  width: 100%;
}
</style>
