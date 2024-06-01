<script lang="ts" setup>
import { definePageMeta, useAuth, watchEffect } from '#imports';
import { EmailConfirmationMarkup } from '~/features/auth';
import { useConfirmEmailApi } from '~/api/auth/useAuthApi';
import { useRoute } from 'vue-router';

definePageMeta({
  layout: 'clear-layout',
});

const confirmEmail = useConfirmEmailApi();
const route = useRoute();
const { handleRefetchProfile } = useAuth();

const handleConfirmEmail = async () => {
  await confirmEmail.mutateAsync(route.query.token as string).then(() => {
    handleRefetchProfile();
  });
};

watchEffect(() => {
  handleConfirmEmail();
});
</script>

<template>
  <EmailConfirmationMarkup
    :error="$t('auth.errors.emailConfirmation')"
    :error-description="$t(`auth.errors.${confirmEmail.error.value?.message}`)"
    :is-error="confirmEmail.isError.value"
    :is-pending="confirmEmail.isPending.value"
    :success-title="$t('auth.emailSuccessfullyVerified')"
  />
</template>

<style lang="scss" module>

</style>
