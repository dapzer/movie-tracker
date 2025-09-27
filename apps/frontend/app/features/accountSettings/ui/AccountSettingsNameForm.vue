<script setup lang="ts">
import type { UserApiUpdateTypes } from "~/api/user/userApiTypes"
import { useI18n } from "#imports"
import { computed } from "vue"
import { toast } from "vue3-toastify"
import * as yup from "yup"
import { useUpdateUserProfileApi } from "~/api/user/useUserApi"
import AccountSettingsFormItem from "~/features/accountSettings/ui/AccountSettingsFormItem.vue"
import { useAuth } from "~/shared/composables/useAuth"
import { useForm } from "~/shared/composables/useForm"
import { UiInput } from "~/shared/ui/UiInput"

const { t } = useI18n()
const { profile } = useAuth()
const updateUserProfileApi = useUpdateUserProfileApi()

const formInitialValue = computed<Pick<UserApiUpdateTypes, "name">>(() => ({
  name: profile?.value?.name || "",
}))

const { formValue, onFormSubmit, isFormValueChanged, errors } = useForm<Pick<UserApiUpdateTypes, "name">>({
  initialValue: formInitialValue,
  validationSchema: yup.object({
    name: yup.string().required().min(1).max(32),
  }),
  onSubmit: (formValue) => {
    updateUserProfileApi.mutateAsync(formValue).then(() => {
      toast.success(t("toasts.accountSettings.successNameChanged"))
    }).catch(() => {
      toast.error(t("toasts.accountSettings.unsuccessfullyNameChanged"))
    })
  },
})
</script>

<template>
  <form @submit.prevent="onFormSubmit">
    <AccountSettingsFormItem
      :title="$t('accountSettings.nameForm.label')"
      :description="$t('accountSettings.nameForm.description')"
      :disabled="!isFormValueChanged || updateUserProfileApi.isPending.value"
    >
      <UiInput
        v-model="formValue.name"
        :disabled="updateUserProfileApi.isPending.value"
        :error="errors?.name"
        maxlength="32"
        :placeholder="t('accountSettings.nameForm.placeholder')"
      />
    </AccountSettingsFormItem>
  </form>
</template>

<style scoped lang="scss">

</style>
