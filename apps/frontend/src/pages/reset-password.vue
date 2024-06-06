<script lang="ts" setup>

import UiContainer from '~/components/ui/UiContainer.vue';
import { useI18n, useSeoMeta } from '#imports';
import { ResetPasswordForm } from '~/features/auth';

const { t } = useI18n();

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${titleChunk} | ${t('auth.resetPasswordProcess')}`;
  },
  ogTitle() {
    return `%s | ${t('auth.resetPasswordProcess')}`;
  },
});
</script>

<template>
  <UiContainer>
    <ResetPasswordForm :class="$style.wrapper" />
  </UiContainer>
</template>

<style lang="scss" module>
.wrapper {
  margin: 0 auto;
  max-width: 460px;
  width: 100%;
}
</style>
