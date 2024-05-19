<script lang="ts" setup>

import UiForm from '~/components/ui/UiForm.vue';
import UiTypography from '~/components/ui/UiTypography.vue';
import UiInput from '~/components/ui/UiInput.vue';
import UiLabel from '~/components/ui/UiLabel.vue';
import type { AuthApiRecoverPasswordTypes } from '~/api/auth/authApiTypes';
import { ref } from 'vue';
import type { ValidationErrorsType } from '~/types/ValidationErrorsType';
import UiButton from '~/components/ui/UiButton.vue';
import { useRecoverPasswordApi } from '~/api/auth/useAuthApi';
import { object } from 'yup';
import { validateAndSave, watch } from '#imports';
import { useRoute } from 'vue-router';
import { emailValidationSchema } from '~/features/auth/model/authValidationSchemas';

const recoverPasswordApi = useRecoverPasswordApi();
const route = useRoute();

const formValue = ref<AuthApiRecoverPasswordTypes>({ email: route.query.email as string || '' });
const errors = ref<ValidationErrorsType>(undefined);
const isEmailSent = ref(false);

watch(formValue.value, () => {
  errors.value = undefined;
  recoverPasswordApi.reset();
});

const validationSchema = object().shape({
  email: emailValidationSchema(),
});

const onRecoverPassword = () => {
  validateAndSave(formValue.value, validationSchema, errors, () => {
    recoverPasswordApi.mutateAsync(formValue.value).then(() => {
      isEmailSent.value = true;
    });
  });
};
</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography
      as="h1"
      variant="title2"
    >
      {{ $t('auth.passwordRecovery') }}
    </UiTypography>
    <UiForm
      v-if="!isEmailSent"
      @submit.prevent="onRecoverPassword"
    >
      <UiLabel :title="$t('auth.email')">
        <UiInput
          v-model="formValue.email"
          :error="errors?.email"
          :placeholder="$t('auth.emailPlaceholder')"
          maxlength="64"
          type="email"
          variant="boxed"
        />
      </UiLabel>

      <UiTypography
        v-if="recoverPasswordApi.isError.value"
        as="span"
        variant="errorText"
      >
        {{ $t(`auth.errors.${recoverPasswordApi.error.value?.message}`) }}
      </UiTypography>

      <UiButton
        :disabled="recoverPasswordApi.isPending.value"
        color-scheme="success"
        type="submit"
      >
        {{ $t('ui.actions.continue') }}
      </UiButton>
    </UiForm>

    <div
      v-else
      :class="$style.emailSent"
    >
      <UiTypography
        variant="title3"
      >
        {{ $t('ui.emailSent') }}
      </UiTypography>

      <UiTypography>
        {{ $t('auth.passwordRecoverySuccess') }}
      </UiTypography>

      <NuxtLink to="/">
        <UiButton>
          {{ $t('ui.actions.backToMainPage') }}
        </UiButton>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  gap: 24px;
  flex-direction: column;
  justify-content: space-between;

  .emailSent {
    display: flex;
    flex-direction: column;
    gap: 12px;

    button {
      margin-top: 14px;
      width: 100%;
    }
  }
}
</style>
