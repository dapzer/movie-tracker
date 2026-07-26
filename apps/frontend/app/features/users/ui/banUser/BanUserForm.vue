<script setup lang="ts">
import type { BanReason, UserPublicType } from "@movie-tracker/types"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { computed } from "vue"
import { toast } from "vue3-toastify"
import * as yup from "yup"
import { useCreateUserBanApi } from "~/api/userBans/useUserBansApi"
import { useForm } from "~/shared/composables/useForm"
import { UiButton } from "~/shared/ui/UiButton"
import { UiConfirmationModal } from "~/shared/ui/UiConfirmationModal"
import { UiSelect } from "~/shared/ui/UiSelect"
import { UiTextarea } from "~/shared/ui/UiTextarea"
import { UiUserProfileLink } from "~/shared/ui/UiUserProfileLink"

type BanDuration = "permanent" | "1d" | "7d" | "30d" | "365d"

interface BanUserFormValue {
  reason?: BanReason
  duration: BanDuration
  comment: string
}

interface BanUserFormProps {
  user: UserPublicType
}

const props = defineProps<BanUserFormProps>()
const emit = defineEmits<{
  (event: "onCancel"): void
  (event: "onSuccess"): void
}>()

const { t } = useI18n()
const localePath = useLocalePath()

const createUserBanApi = useCreateUserBanApi()

const banDurationDays: Partial<Record<BanDuration, number>> = {
  "1d": 1,
  "7d": 7,
  "30d": 30,
  "365d": 365,
}

function getExpiresAt(duration: BanDuration) {
  const days = banDurationDays[duration]

  if (!days) {
    // Permanent ban
    return undefined
  }

  return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
}

const { formValue, onFormSubmit, errors } = useForm<BanUserFormValue>({
  initialValue: {
    reason: "SPAM",
    duration: "7d",
    comment: "",
  },
  onSubmit: async (formValue) => {
    if (!formValue.reason) {
      return
    }

    await createUserBanApi.mutateAsync({
      userId: props.user.id,
      reason: formValue.reason,
      comment: formValue.comment || undefined,
      expiresAt: getExpiresAt(formValue.duration),
    }).then(() => {
      toast.success(t("toasts.userBan.successCreated"))
      emit("onSuccess")
    }).catch(() => {
      toast.error(t("toasts.userBan.unsuccessfullyCreated"))
    })
  },
  validationSchema: yup.object().shape({
    reason: yup.string().required(t("validation.required")),
    duration: yup.string().required(t("validation.required")),
    comment: yup.string().nullable().optional(),
  }),
})

const reasonOptions = computed(() => [
  {
    label: t("users.ban.reason.spam"),
    value: "SPAM",
  },
  {
    label: t("users.ban.reason.toxicity"),
    value: "TOXICITY",
  },
  {
    label: t("users.ban.reason.msfw"),
    value: "MSFW",
  },
  {
    label: t("users.ban.reason.fraud"),
    value: "FRAUD",
  },
  {
    label: t("users.ban.reason.other"),
    value: "OTHER",
  },
])

const durationOptions = computed(() => [
  {
    label: t("users.ban.duration.permanent"),
    value: "permanent",
  },
  {
    label: t("users.ban.duration.oneDay"),
    value: "1d",
  },
  {
    label: t("users.ban.duration.sevenDays"),
    value: "7d",
  },
  {
    label: t("users.ban.duration.thirtyDays"),
    value: "30d",
  },
  {
    label: t("users.ban.duration.oneYear"),
    value: "365d",
  },
])
</script>

<template>
  <form
    :class="$style.wrapper"
    @submit.prevent="onFormSubmit"
  >
    <UiUserProfileLink
      :user-id="props.user.id"
      :user-name="props.user.name"
      :user-avatar-src="props.user.image"
      :user-page-url="localePath(`/profile/${props.user.id}`)"
    />

    <UiSelect
      v-model="formValue.reason"
      :options="reasonOptions"
      :placeholder="$t('users.ban.form.reasonPlaceholder')"
    />

    <UiSelect
      v-model="formValue.duration"
      :options="durationOptions"
      :placeholder="$t('users.ban.form.durationPlaceholder')"
    />

    <UiTextarea
      v-model="formValue.comment"
      :error="errors?.comment"
      :placeholder="$t('users.ban.form.commentPlaceholder')"
      maxlength="1000"
    />

    <div :class="$style.actions">
      <UiButton
        size="small"
        scheme="tertiary"
        with-icon
        type="button"
        @click="emit('onCancel')"
      >
        {{ $t('ui.actions.cancel') }}
      </UiButton>

      <UiConfirmationModal
        :title="$t('users.ban.confirm.title')"
        :description="$t('users.ban.confirm.description', { userName: props.user.name })"
        :confirm-text="$t('ui.yes')"
        :cancel-text="$t('ui.no')"
        scheme="danger"
        @confirm="onFormSubmit"
      >
        <template #trigger="{ openModal }">
          <UiButton
            :disabled="createUserBanApi.isPending.value"
            size="small"
            type="button"
            @click="openModal"
          >
            {{ $t('users.ban.form.submit') }}
          </UiButton>
        </template>
      </UiConfirmationModal>
    </div>
  </form>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .actions {
    margin-top: 8px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style>
