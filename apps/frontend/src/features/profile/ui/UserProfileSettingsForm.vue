<script lang="ts" setup>
import type { UserApiUpdateTypes } from '~/api/user/userApiTypes';
import UiForm from '~/components/ui/UiForm.vue';
import { imageUrlValidationSchema, nameValidationSchema } from '~/shared/lib';
import { object } from 'yup';
import { useForm } from '~/composables/useForm';
import { useAuth, useI18n, watch } from '#imports';
import UiLabel from '~/components/ui/UiLabel.vue';
import UiInput from '~/components/ui/UiInput.vue';
import { useUpdateUserProfileApi } from '~/api/user/useUserApi';
import UiFormActions from '~/components/ui/UiFormActions.vue';
import { computed } from 'vue';
import { toast } from 'vue3-toastify';
import UiTypography from '~/components/ui/UiTypography.vue';

const { profile, handleRefetchProfile } = useAuth();
const { t } = useI18n();
const updateUserProfileApi = useUpdateUserProfileApi();

const initialValue = computed(() => {
  return {
    name: profile.value?.name || '',
    image: profile.value?.image || '',
  };
});

const { formValue, errors, onFormSubmit, resetToInitialValue, isFormValueChanged } = useForm<UserApiUpdateTypes>({
  initialValue: initialValue,
  validationSchema: object().shape({
    name: nameValidationSchema(t),
    image: imageUrlValidationSchema(t),
  }),
  onSubmit: (formValue) => {
    updateUserProfileApi.mutateAsync(formValue).then(() => {
      handleRefetchProfile();
      toast.success(t('toasts.user.profileUpdated'));
    });
  },
});

watch(() => formValue.value, () => {
  errors.value = undefined;
  updateUserProfileApi.reset();
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
      <UiLabel :title="$t('auth.name')">
        <UiInput
          v-model="formValue.name"
          :error="errors?.name"
          :placeholder="$t('auth.namePlaceholder')"
          maxlength="32"
          variant="boxed"
        />
      </UiLabel>
      <UiLabel :title="$t('auth.image')">
        <UiInput
          v-model="formValue.image"
          :error="errors?.image"
          :placeholder="$t('auth.imagePlaceholder')"
          maxlength="500"
          variant="boxed"
        />
      </UiLabel>

      <UiTypography
        v-if="updateUserProfileApi.isError.value"
        as="span"
        variant="errorText"
      >
        {{ $t(`auth.errors.${updateUserProfileApi.error.value?.message}`) }}
      </UiTypography>

      <UiFormActions
        :class="$style.actions"
        :is-cancel-disabled="updateUserProfileApi.isPending.value || !isFormValueChanged"
        :is-confirm-disabled="updateUserProfileApi.isPending.value || !isFormValueChanged"
        @cancel="resetToInitialValue"
        @confirm="onFormSubmit"
      />
    </UiForm>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;

  .actions {
    flex-wrap: nowrap;

    button {
      width: 100%;
    }
  }
}
</style>
