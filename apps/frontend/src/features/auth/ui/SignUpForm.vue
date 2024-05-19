<script lang="ts" setup>

import { NuxtLink } from '#components';
import UiTypography from '~/components/ui/UiTypography.vue';
import UiLabel from '~/components/ui/UiLabel.vue';
import UiInput from '~/components/ui/UiInput.vue';
import UiButton from '~/components/ui/UiButton.vue';
import { useSignUpApi } from '~/api/auth/useAuthApi';
import { ref } from 'vue';
import type { AuthApiSignUpTypes } from '~/api/auth/authApiTypes';
import type { ValidationErrorsType } from '~/types/ValidationErrorsType';
import { useAuth, useI18n, useSeoMeta, validateAndSave, watch } from '#imports';
import { object, string } from 'yup';
import { useRouter } from 'vue-router';
import { useLocalStorage } from '@vueuse/core';
import { FetchError } from '@movie-tracker/utils';
import { useHandleResetUserData } from '~/composables/useHandleResetUserData';
import SignInByProvider from '~/features/auth/ui/SignInByProvider.vue';
import UiDivider from '~/components/ui/UiDivider.vue';
import { SignUpLocalStorageKey } from '~/features/auth';

const signUpsApi = useSignUpApi();

const { t } = useI18n();
const router = useRouter();
const { isAuthorized } = useAuth();
const { handleResetUserStates } = useHandleResetUserData();

const signUpRedirectUrl = useLocalStorage(SignUpLocalStorageKey.SIGN_UP_REDIRECT_URL, '');
const formValue = ref<AuthApiSignUpTypes>({ email: '', password: '', name: '' });
const errors = ref<ValidationErrorsType>(undefined);
const isShowResetPasswordLink = ref(false);

watch(isAuthorized, (isAuthorized) => {
  if (isAuthorized) {
    router.push(signUpRedirectUrl.value || "/");
    signUpRedirectUrl.value = '';
  }
});

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${titleChunk} | ${t('auth.createAccount')}`;
  },
  ogTitle() {
    return `%s | ${t('auth.createAccount')}`;
  },
});

watch(formValue.value, () => {
  errors.value = undefined;
  isShowResetPasswordLink.value = false;
  signUpsApi.reset();
});

const validationSchema = object().shape({
  name: string().required(t('errors.required')).min(1, t('auth.errors.nameInvalid')).max(32, t('auth.errors.nameInvalid')),
  email: string().email(t('auth.errors.emailNotValid')).required(t('errors.required')),
  password: string().required(t('errors.required')).min(8, t('auth.errors.passwordNotValid')).max(32, t('auth.errors.passwordNotValid')),
});

const onSignUp = () => {
  validateAndSave(
    formValue.value,
    validationSchema,
    errors,
    () => {
      signUpsApi.mutateAsync(formValue.value).then(() => {
        handleResetUserStates();
      }).catch((err) => {
        if (err instanceof FetchError) {
          if (err.statusCode === 409) {
            isShowResetPasswordLink.value = true;
          }
        }
      });
    },
  );
};
</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography
      as="h1"
      variant="title2"
    >
      {{ $t('auth.createAccount') }}
    </UiTypography>
    <form @submit.prevent="onSignUp">
      <UiLabel :title="$t('auth.name')">
        <UiInput
          v-model="formValue.name"
          :error="errors?.name"
          :placeholder="$t('auth.namePlaceholder')"
          maxlength="32"
          variant="boxed"
        />
      </UiLabel>
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

      <UiTypography
        v-if="signUpsApi.isError.value"
        :class="$style.errorText"
        as="span"
        variant="textSmall"
      >
        {{ $t(`auth.errors.${signUpsApi.error.value?.message}`) }}.
        <UiTypography
          v-if="isShowResetPasswordLink"
          :as="NuxtLink"
          :class="$style.resetPasswordLink"
          :to="`/reset-password?email=${formValue.email}`"
          variant="linkUnderlined"
        >
          {{ $t('auth.recoverPassword') }}?
        </UiTypography>
      </UiTypography>

      <UiButton
        :class="$style.submitButton"
        :disabled="signUpsApi.isPending.value"
        color-scheme="success"
      >
        {{ $t('auth.signUp') }}
      </UiButton>
    </form>

    <UiDivider>
      <UiTypography>
        {{ $t('ui.or').toLowerCase() }}
      </UiTypography>
    </UiDivider>

    <SignInByProvider />
  </div>
</template>

<style lang="scss" module>
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;

  form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;

    .errorText {
      color: var(--c-danger);
      font-weight: var(--fw-regular);
    }

    .submitButton {
      margin-top: 14px;
    }

    .resetPasswordLink {
      display: inline;
      font-size: inherit;
    }
  }
}
</style>
