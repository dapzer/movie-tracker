<script lang="ts" setup>

import UiForm from '~/components/ui/UiForm.vue';
import UiInput from '~/components/ui/UiInput.vue';
import UiLabel from '~/components/ui/UiLabel.vue';
import type { ValidationErrorsType } from '~/types/ValidationErrorsType';
import { ref } from 'vue';
import { useResetPasswordApi } from '~/api/auth/useAuthApi';
import { object } from 'yup';
import { useHandleResetUserData, useI18n, validateAndSave } from '#imports';
import { useRoute, useRouter } from 'vue-router';
import UiTypography from '~/components/ui/UiTypography.vue';
import UiButton from '~/components/ui/UiButton.vue';
import { passwordValidationSchema } from '~/features/auth/model/authValidationSchemas';

interface FormValue {
  password: string;
  repeatedPassword: string;
}

const resetPasswordApi = useResetPasswordApi();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { handleResetUserStates } = useHandleResetUserData();

const formValue = ref<FormValue>({ password: '', repeatedPassword: '' });
const errors = ref<ValidationErrorsType>(undefined);

const validationSchema = object().shape({
  password: passwordValidationSchema(),
  repeatedPassword: passwordValidationSchema().test({
    name: 'repeatedPassword',
    message: t('auth.errors.passwordNotMatch'),
    test(value) {
      return value === formValue.value.password;
    },
  }),
});

const onResetPassword = () => {
  validateAndSave(formValue.value, validationSchema, errors, () => {
    resetPasswordApi.mutateAsync({
      password: formValue.value.password,
      token: route.query.token as string || '',
    }).then(() => {
      handleResetUserStates();
      router.push('/');
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
      {{ $t('auth.resetPasswordProcess') }}
    </UiTypography>
    <UiForm @submit.prevent="onResetPassword">
      <UiLabel :title="$t('auth.password')">
        <UiInput
          v-model="formValue.password"
          :error="errors?.password"
          :placeholder="$t('auth.passwordPlaceholder')"
          maxlength="256"
          type="password"
          variant="boxed"
        />
      </UiLabel>
      <UiLabel :title="$t('auth.repeatPassword')">
        <UiInput
          v-model="formValue.repeatedPassword"
          :error="errors?.repeatedPassword"
          :placeholder="$t('auth.repeatPasswordPlaceholder')"
          maxlength="256"
          type="password"
          variant="boxed"
        />
      </UiLabel>

      <UiTypography
        v-if="resetPasswordApi.isError.value"
        as="span"
        variant="errorText"
      >
        {{ $t(`auth.errors.${resetPasswordApi.error.value?.message}`) }}
      </UiTypography>

      <UiButton
        :disabled="resetPasswordApi.isPending.value"
        type="submit"
      >
        {{ $t('auth.resetPassword') }}
      </UiButton>
    </UiForm>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;

}
</style>
