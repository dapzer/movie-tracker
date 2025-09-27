<script setup lang="ts">
import type { UserApiUpdateTypes } from "~/api/user/userApiTypes"
import { useI18n } from "#imports"
import { UserMediaRatingsAccessLevelEnum } from "@movie-tracker/types"
import { computed } from "vue"
import { toast } from "vue3-toastify"
import { useUpdateUserProfileApi } from "~/api/user/useUserApi"
import AccountSettingsFormItem from "~/features/accountSettings/ui/AccountSettingsFormItem.vue"
import { useAuth } from "~/shared/composables/useAuth"
import { useForm } from "~/shared/composables/useForm"
import { UiSelect } from "~/shared/ui/UiSelect"

const { t } = useI18n()
const { profile } = useAuth()
const updateUserProfileApi = useUpdateUserProfileApi()

const formInitialValue = computed<Pick<UserApiUpdateTypes, "mediaRatingsAccessLevel">>(() => ({
  mediaRatingsAccessLevel: profile?.value?.mediaRatingsAccessLevel || UserMediaRatingsAccessLevelEnum.PUBLIC,
}))

const { formValue, onFormSubmit, isFormValueChanged } = useForm<Pick<UserApiUpdateTypes, "mediaRatingsAccessLevel">>({
  initialValue: formInitialValue,
  onSubmit: (formValue) => {
    updateUserProfileApi.mutateAsync(formValue).then(() => {
      toast.success(t("toasts.accountSettings.successMediaRatingsAccessLevelChanged"))
    }).catch(() => {
      toast.error(t("toasts.accountSettings.unsuccessfullyMediaRatingsAccessLevelChanged"))
    })
  },
})

const selectOptions = computed(() => {
  return [
    {
      label: t("accountSettings.mediaRatingsAccessForm.options.public"),
      value: UserMediaRatingsAccessLevelEnum.PUBLIC,
    },
    {
      label: t("accountSettings.mediaRatingsAccessForm.options.private"),
      value: UserMediaRatingsAccessLevelEnum.PRIVATE,
    },
  ]
})
</script>

<template>
  <form @submit.prevent="onFormSubmit">
    <AccountSettingsFormItem
      :title="$t('accountSettings.mediaRatingsAccessForm.label')"
      :description="$t('accountSettings.mediaRatingsAccessForm.description')"
      :disabled="!isFormValueChanged || updateUserProfileApi.isPending.value"
    >
      <UiSelect
        v-model="formValue.mediaRatingsAccessLevel"
        :options="selectOptions"
      />
    </AccountSettingsFormItem>
  </form>
</template>

<style scoped lang="scss">

</style>
