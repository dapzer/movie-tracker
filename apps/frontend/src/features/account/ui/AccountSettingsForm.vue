<script lang="ts" setup>

import UiTypography from '~/components/ui/UiTypography.vue';
import UiForm from '~/components/ui/UiForm.vue';
import { useAuth, useForm, useI18n } from '#imports';
import UiInput from '~/components/ui/UiInput.vue';
import UiLabel from '~/components/ui/UiLabel.vue';
import { computed, ref } from 'vue';
import { object } from 'yup';
import { emailValidationSchema } from '~/shared/lib';
import { toast } from 'vue3-toastify';
import { useRequestChangeEmailApi, useRequestEmailConfirmationApi } from '~/api/auth/useAuthApi';
import UiFormActions from '~/components/ui/UiFormActions.vue';

const { t } = useI18n();
const { profile } = useAuth();
const requestChangeEmailApi = useRequestChangeEmailApi();
const requestEmailConfirmation = useRequestEmailConfirmationApi();
const isConfirmationEmailSent = ref(false);

const initialValue = computed(() => {
  return {
    email: profile.value?.email || '',
  };
});

const requestEmailConfirmationMail = () => {
  requestEmailConfirmation.mutateAsync().then(() => {
    toast.success(t('toasts.user.confirmationEmailSent'));
    isConfirmationEmailSent.value = true;
  }).catch(() => {
    toast.error(t('toasts.user.requestEmailConfirmation'));
  })
};

const { formValue, errors, onFormSubmit, resetToInitialValue, isFormValueChanged } = useForm({
  initialValue: initialValue,
  validationSchema: object().shape({
    email: emailValidationSchema(t),
  }),
  onSubmit: (formValue) => {
    requestChangeEmailApi.mutateAsync(formValue.email).then(() => {
      isConfirmationEmailSent.value = true;
      toast.success(t('toasts.user.newEmailConfirmationEmailSent'));
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
      {{ $t('navigation.accountSettings') }}
    </UiTypography>

    <UiForm @submit.prevent>
      <UiLabel :title="$t('auth.email')">
        <UiInput
          v-model="formValue.email"
          :disabled="profile?.isEmailVerified"
          :error="errors?.email"
          :placeholder="$t('auth.emailPlaceholder')"
          maxlength="64"
          type="email"
          variant="boxed"
        />
      </UiLabel>

      <UiTypography
        v-if="requestChangeEmailApi.isError.value"
        as="span"
        variant="errorText"
      >
        {{ $t(`auth.errors.${requestChangeEmailApi.error.value?.message}`) }}
      </UiTypography>

      <template v-if="!profile?.isEmailVerified">
        <UiTypography
          v-if="profile?.email === formValue.email && !isConfirmationEmailSent"
          variant="errorText"
        >
          {{ $t(`auth.emailNotVerified`) }}.
          <UiTypography
            :class="$style.verifyEmail"
            as="button"
            variant="linkUnderlined"
            @click="requestEmailConfirmationMail"
          >
            {{ $t(`auth.verifyEmail`) }}
          </UiTypography>
        </UiTypography>

        <UiFormActions
          :class="$style.actions"
          :is-cancel-disabled="requestChangeEmailApi.isPending.value || !isFormValueChanged"
          :is-confirm-disabled="requestChangeEmailApi.isPending.value || !isFormValueChanged"
          @cancel="resetToInitialValue"
          @confirm="onFormSubmit"
        />
      </template>

      <UiTypography
        v-else
        :class="$style.verified"
        variant="textSmall"
      >
        {{ $t(`auth.emailVerified`) }}
      </UiTypography>
    </UiForm>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;

  .verifyEmail {
    font-size: inherit;
    color: inherit;
    border-color: var(--c-danger);
    background: none;
    border: none;
    border-bottom: 1px solid;

    &:hover {
      color: var(--c-danger-hovered);
      border-color: var(--c-danger-hovered) !important;
    }
  }

  .verified {
    color: var(--c-success);
  }

  .actions {
    flex-wrap: nowrap;

    button {
      width: 100%;
    }
  }
}
</style>
