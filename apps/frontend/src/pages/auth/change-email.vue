<script lang="ts" setup>
import { definePageMeta, useAuth, watchEffect } from '#imports';
import { EmailConfirmationMarkup } from '~/features/auth';
import { useConfirmChangeEmailApi, useConfirmEmailApi } from '~/api/auth/useAuthApi';
import { useRoute } from 'vue-router';

definePageMeta({
  layout: 'clear-layout',
});

const confirmChangeEmail = useConfirmChangeEmailApi();
const route = useRoute();
const { handleRefetchProfile } = useAuth();

const handleConfirmChangeEmail = async () => {
  await confirmChangeEmail.mutateAsync(route.query.token as string).then(() => {
    handleRefetchProfile();
  });
};

watchEffect(() => {
  handleConfirmChangeEmail();
});
</script>

<template>
  <EmailConfirmationMarkup
    :error="$t('auth.errors.emailChanging')"
    :error-description="$t(`auth.errors.${confirmChangeEmail.error.value?.message}`)"
    :is-error="confirmChangeEmail.isError.value"
    :is-pending="confirmChangeEmail.isPending.value"
    :success-title="$t('auth.emailSuccessfullyChanged')"
  />
</template>

<style lang="scss" module>

</style>
