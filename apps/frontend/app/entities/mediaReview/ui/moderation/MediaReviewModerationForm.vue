<script setup lang="ts">
import { useI18n } from "#imports"
import { MediaReviewModerationLogAction, MediaReviewModerationLogReason } from "@movie-tracker/types"
import { computed } from "vue"
import * as yup from "yup"
import { useModerateMediaReviewApi } from "~/api/mediaReviewModeration/useMediaReviewModerationApi"
import { useForm } from "~/shared/composables/useForm"
import { UiButton } from "~/shared/ui/UiButton"
import { UiConfirmationModal } from "~/shared/ui/UiConfirmationModal"
import { UiSelect } from "~/shared/ui/UiSelect"
import { UiTextarea } from "~/shared/ui/UiTextarea"

interface MediaReviewModerationFormValue {
  action: MediaReviewModerationLogAction.CHANGES_REQUESTED | MediaReviewModerationLogAction.REJECTED
  reason: MediaReviewModerationLogReason | undefined
  comment: string
}

interface MediaReviewModerationFormProps {
  mediaReviewId: string
}

const props = defineProps<MediaReviewModerationFormProps>()

const emit = defineEmits<{
  (event: "onCancel"): void
  (event: "onSuccess"): void
}>()

const moderateMediaReviewApi = useModerateMediaReviewApi()

const { t } = useI18n()

const { formValue, onFormSubmit, errors } = useForm<MediaReviewModerationFormValue>({
  initialValue: {
    action: MediaReviewModerationLogAction.CHANGES_REQUESTED,
    reason: undefined,
    comment: "",
  },
  onSubmit: async (formValue) => {
    await moderateMediaReviewApi.mutateAsync({
      mediaReviewId: props.mediaReviewId,
      action: formValue.action,
      reason: formValue.reason ?? null,
      comment: formValue.comment || null,
    })
    emit("onSuccess")
  },
  validationSchema: formValue =>
    yup.object().shape({
      action: yup.string().oneOf([MediaReviewModerationLogAction.CHANGES_REQUESTED, MediaReviewModerationLogAction.REJECTED]).required(t("validation.required")),
      reason: formValue.action === MediaReviewModerationLogAction.REJECTED
        ? yup.string().required(t("validation.required"))
        : yup.string().nullable().optional(),
      comment: yup.string().nullable().optional(),
    }),
})

const actionOptions = computed(() => [
  {
    label: t("mediaReviews.moderation.status.changesRequested"),
    value: MediaReviewModerationLogAction.CHANGES_REQUESTED,
  },
  {
    label: t("mediaReviews.moderation.status.removed"),
    value: MediaReviewModerationLogAction.REJECTED,
  },
])

const reasonOptions = computed(() => [
  {
    label: t("mediaReviews.moderation.reason.offTopic"),
    value: MediaReviewModerationLogReason.OFF_TOPIC,
  },
  {
    label: t("mediaReviews.moderation.reason.spam"),
    value: MediaReviewModerationLogReason.SPAM,
  },
  {
    label: t("mediaReviews.moderation.reason.toxicity"),
    value: MediaReviewModerationLogReason.TOXICITY,
  },
  {
    label: t("mediaReviews.moderation.reason.lowEffortJunk"),
    value: MediaReviewModerationLogReason.LOW_EFFORT_JUNK,
  },
  {
    label: t("mediaReviews.moderation.reason.other"),
    value: MediaReviewModerationLogReason.OTHER,
  },
])
</script>

<template>
  <form
    :class="$style.wrapper"
    @submit.prevent="onFormSubmit"
  >
    <UiSelect
      v-model="formValue.action"
      :options="actionOptions"
      :placeholder="$t('mediaReviews.moderation.form.statusPlaceholder')"
    />

    <UiSelect
      v-model="formValue.reason"
      :options="reasonOptions"
      :placeholder="$t('mediaReviews.moderation.form.reasonPlaceholder')"
    />

    <UiTextarea
      v-model="formValue.comment"
      :error="errors?.comment"
      :placeholder="$t('mediaReviews.moderation.form.descriptionPlaceholder')"
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
        :title="$t('mediaReviews.moderation.result.confirm.title')"
        :description="$t('mediaReviews.moderation.result.confirm.description')"
        :confirm-text="$t('ui.yes')"
        :cancel-text="$t('ui.no')"
        scheme="danger"
        @confirm="onFormSubmit"
      >
        <template #trigger="{ openModal }">
          <UiButton
            :disabled="moderateMediaReviewApi.isPending.value"
            size="small"
            type="button"
            @click="openModal"
          >
            {{ $t('ui.actions.saveChanges') }}
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

  .field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .error {
    color: var(--c-error);
  }

  .actions {
    margin-top: 8px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style>
