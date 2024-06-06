<script lang="ts" setup>

import UiForm from '~/components/ui/UiForm.vue';
import UiInput from '~/components/ui/UiInput.vue';
import UiLabel from '~/components/ui/UiLabel.vue';
import { useResetPasswordApi } from '~/api/auth/useAuthApi';
import { object } from 'yup';
import { useForm, useHandleResetUserData, useI18n } from '#imports';
import { useRoute, useRouter } from 'vue-router';
import UiTypography from '~/components/ui/UiTypography.vue';
import UiButton from '~/components/ui/UiButton.vue';
import { passwordValidationSchema } from '~/shared/lib';

interface FormValueType {
  password: string;
  repeatedPassword: string;
}

const resetPasswordApi = useResetPasswordApi();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { handleResetUserStates } = useHandleResetUserData();

const { formValue, errors, onFormSubmit } = useForm<FormValueType>({
  initialValue: {
    password: '',
    repeatedPassword: '',
  },
  validationSchema: (formValue) => object().shape({
    password: passwordValidationSchema(t),
    repeatedPassword: passwordValidationSchema(t).test({
      name: 'repeatedPassword',
      message: t('auth.errors.passwordNotMatch'),
      test(value) {
        return value === formValue.password;
      },
    }),
  }),
  onSubmit: (formValue) => {
    resetPasswordApi.mutateAsync({
      password: formValue.password,
      token: route.query.token as string || '',
    }).then(() => {
      handleResetUserStates();
      router.push('/');
    });
  },
});
</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography
      as="h1"
      variant="title2"
    >
      {{ $t('auth.resetPasswordProcess') }}
    </UiTypography>
    <UiForm @submit.prevent="onFormSubmit">
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
