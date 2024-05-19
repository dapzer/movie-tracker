<script lang="ts" setup>

import UiModal, { type UiModalProps } from '~/components/ui/UiModal/UiModal.vue';
import UiButton from '~/components/ui/UiButton.vue';
import { useSignInApi } from '~/api/auth/useAuthApi';
import { ref } from 'vue';
import { useRoute } from '#app';
import UiLabel from '~/components/ui/UiLabel.vue';
import UiInput from '~/components/ui/UiInput.vue';
import UiDivider from '~/components/ui/UiDivider.vue';
import UiTypography from '~/components/ui/UiTypography.vue';
import { object, string } from 'yup';
import type { ValidationErrorsType } from '~/types/ValidationErrorsType';
import type { AuthApiSignInTypes } from '~/api/auth/authApiTypes';
import { validateAndSave } from '~/utils/validateAndSave';
import { useI18n, watch } from '#imports';
import { useHandleResetUserData } from '~/composables/useHandleResetUserData';
import SignInByProvider from '~/features/auth/ui/SignInByProvider.vue';
import { NuxtLink } from '#components';
import { SignUpLocalStorageKey } from '~/features/auth';
import UiForm from '~/components/ui/UiForm.vue';
import { emailValidationSchema, passwordValidationSchema } from '~/features/auth/model/authValidationSchemas';

interface LoginModalProps extends Partial<Pick<UiModalProps, 'buttonVariant' | 'buttonColorScheme' | 'externalOpenedState'
  | 'isHideTrigger' | 'buttonSize'>> {
  btnTitle?: string;
}

const props = defineProps<LoginModalProps>();

const emits = defineEmits<{
  (event: 'additionalHandler', currentVisibleState: boolean): void;
}>();

const signInApi = useSignInApi();

const route = useRoute();
const isModalVisible = ref(props.externalOpenedState);
const formValue = ref<AuthApiSignInTypes>({ email: '', password: '' });
const errors = ref<ValidationErrorsType>(undefined);

const { handleResetUserStates } = useHandleResetUserData();

watch(formValue.value, () => {
  errors.value = undefined;
  signInApi.reset();
});

const validationSchema = object().shape({
  email: emailValidationSchema(),
  password: passwordValidationSchema(),
});

const onSignIn = () => {
  validateAndSave(formValue.value, validationSchema, errors, () => {
    signInApi.mutateAsync(formValue.value).then(() => {
      handleVisible(false);
      emits('additionalHandler', false);
      handleResetUserStates();
    });
  });
};

const handleVisible = (value: boolean) => {
  emits('additionalHandler', value);
  isModalVisible.value = value;
};

const onClickSignUpLink = async () => {
  localStorage.setItem(SignUpLocalStorageKey.SIGN_UP_REDIRECT_URL, route.fullPath);
  handleVisible(false);
  emits('additionalHandler', false);
};
</script>

<template>
  <UiModal
    :buttonColorScheme="props.buttonColorScheme"
    :buttonSize="props.buttonSize"
    :buttonVariant="props.buttonVariant"
    :externalOpenedState="isModalVisible"
    :isHideTrigger="props.isHideTrigger"
    :maxWidth="500"
    :title="$t('auth.signIn')"
    isFullWidth
    v-bind="$attrs"
    @additional-handler="handleVisible"
  >
    <template #trigger>
      {{ props.btnTitle || $t('auth.signIn') }}
    </template>

    <template #content>
      <div :class="$style.wrapper">
        <UiForm @submit.prevent="onSignIn">
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
            :as="NuxtLink"
            :class="$style.resetPasswordLink"
            to="/recover-password"
            variant="linkUnderlined"
            @click="handleVisible(false)"
          >
            {{ $t('auth.recoverPassword') }}?
          </UiTypography>

          <UiTypography
            v-if="signInApi.isError.value"
            as="span"
            variant="errorText"
          >
            {{ $t(`auth.errors.${signInApi.error.value?.message}`) }}
          </UiTypography>

          <UiButton
            type="submit"
            :disabled="signInApi.isPending.value"
            color-scheme="success"
          >
            {{ $t('auth.signIn') }}
          </UiButton>

          <UiTypography variant="textSmall">
            {{ $t('auth.haveNoAccount') }}
            <UiTypography
              :as="NuxtLink"
              :class="$style.signUpLink"
              to="/sign-up"
              variant="linkUnderlined"
              @click="onClickSignUpLink"
            >
              {{ $t('auth.signUp') }}
            </UiTypography>
          </UiTypography>
        </UiForm>

        <UiDivider>
          <UiTypography>
            {{ $t('ui.or').toLowerCase() }}
          </UiTypography>
        </UiDivider>

        <SignInByProvider @on-success-sign-in="handleVisible(false)" />
      </div>
    </template>
  </UiModal>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  gap: 24px;
  flex-direction: column;
  justify-content: space-between;

  form {
    .signUpLink {
      font-size: inherit;
    }

    .resetPasswordLink {
      text-align: right;
      margin-left: auto;
      width: fit-content;
      font-size: var(--fs-span);
    }
  }
}
</style>
